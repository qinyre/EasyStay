import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NavBar, Card, Button, Dialog, Toast } from 'antd-mobile';
import { ChevronLeft, Phone, User, Copy, Clock, AlertCircle } from 'lucide-react';
import { getBookingById, cancelBooking, updateBookingStatus } from '../services/api';
import { Booking } from '../types';
import { formatCurrency, formatDate } from '../utils/format';
import { PaymentModal } from '../components/PaymentModal';
import { useCountdown } from '../hooks/useCountdown';

const BookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paying, setPaying] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // 倒计时（15分钟）
  const { formattedTime, isExpired, reset: resetCountdown } = useCountdown({
    minutes: 15,
    onExpire: () => {
      if (booking?.status === 'pending') {
        Toast.show({
          content: '订单已超时，已自动取消',
          icon: 'fail',
        });
        // 自动取消订单
        handleAutoCancel();
      }
    },
  });

  useEffect(() => {
    if (id) {
      getBookingById(id).then(setBooking);
    }
  }, [id]);

  // 重置倒计时（当订单加载时）
  useEffect(() => {
    if (booking?.status === 'pending') {
      const createdTime = new Date(booking.createdAt);
      const now = new Date();
      const elapsedMinutes = (now.getTime() - createdTime.getTime()) / (1000 * 60);
      const remainingMinutes = Math.max(0, 15 - elapsedMinutes);

      if (remainingMinutes > 0) {
        resetCountdown(Math.ceil(remainingMinutes));
      }
    }
  }, [booking, resetCountdown]);

  const handlePayment = async (method: string) => {
    if (!booking) return;

    setPaying(true);
    try {
      // 模拟支付过程
      console.log('Payment method:', method);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 更新订单状态为已确认
      await updateBookingStatus(booking.id, 'confirmed');

      Toast.show({
        content: '支付成功！',
        icon: 'success',
        duration: 1500,
      });

      // 直接跳转到订单详情页
      setTimeout(() => {
        navigate(`/booking/${booking.id}`);
      }, 500);
    } catch (error) {
      console.error('Payment error:', error);
      Toast.show({
        content: '支付失败，请重试',
        icon: 'fail',
      });
    } finally {
      setPaying(false);
    }
  };

  const handleAutoCancel = async () => {
    if (!booking) return;

    try {
      await cancelBooking(booking.id);
      setBooking((prev) => prev ? { ...prev, status: 'cancelled' } : null);
    } catch (error) {
      console.error('Auto cancel error:', error);
    }
  };

  const handleCancel = async () => {
    if (!booking) return;

    const result = await Dialog.confirm({
      content: t('booking.cancel_confirm'),
      confirmText: t('common.confirm'),
      cancelText: t('common.cancel'),
    });

    if (result) {
      setCancelling(true);
      try {
        await cancelBooking(booking.id);
        setBooking((prev) => prev ? { ...prev, status: 'cancelled' } : null);
        Toast.show({
          icon: 'success',
          content: t('booking.cancel_success'),
        });
      } catch (error) {
        console.error('Cancel error:', error);
        Toast.show({
          icon: 'fail',
          content: t('booking.cancel_failed'),
        });
      } finally {
        setCancelling(false);
      }
    }
  };

  if (!booking) return <div className="p-10 text-center text-gray-500">加载中...</div>;

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-[#fff7ed] border-[#ffedd5] text-[#ea580c]';
      case 'confirmed': return 'bg-[#f0fdf4] border-[#dcfce7] text-[#16a34a]';
      case 'completed': return 'bg-[#eff6ff] border-[#dbeafe] text-[#2563eb]';
      case 'cancelled': return 'bg-[#f8fafc] border-[#f1f5f9] text-[#475569]';
      default: return 'bg-[#f8fafc] border-[#f1f5f9] text-[#475569]';
    }
  };

  const isPending = booking.status === 'pending';

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col pb-safe">
      <NavBar onBack={() => navigate(-1)} backArrow={<ChevronLeft size={24} />} className="bg-white border-b border-slate-100">
        {t('booking.detail_title')}
      </NavBar>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Status Card with Countdown */}
        <div className={`${getStatusBgColor(booking.status)} p-5 rounded-2xl border shadow-[0_2px_8px_rgba(0,0,0,0.02)]`}>
          <div className="text-xl font-bold mb-1">
            {t(`booking.status.${booking.status}`)}
          </div>
          <div className="opacity-80 text-sm mb-4">
            {isExpired ? '订单已超时取消' : t(`booking.status_desc.${booking.status}`)}
          </div>

          {/* 倒计时 */}
          {isPending && !isExpired && (
            <div className="bg-white/80 rounded-xl p-3 shadow-sm border border-white/40">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm text-orange-700 font-medium">
                  <Clock size={16} />
                  <span>支付剩余时间</span>
                </div>
                <div className="font-mono font-bold text-lg text-orange-600 tracking-wider">{formattedTime}</div>
              </div>
              <div className="w-full bg-orange-100 rounded-full h-1.5 line-clamp-1 overflow-hidden">
                <div
                  className="bg-orange-500 h-1.5 rounded-full transition-all duration-1000"
                  style={{
                    width: `${((15 * 60 - parseInt(formattedTime.split(':')[0]) * 60 - parseInt(formattedTime.split(':')[1])) / (15 * 60)) * 100}%`
                  }}
                />
              </div>
            </div>
          )}

          {/* 过期提示 */}
          {isPending && isExpired && (
            <div className="flex items-center gap-2 text-sm bg-slate-100/80 rounded-xl p-3 text-slate-600 mt-2 border border-white/40">
              <AlertCircle size={16} />
              <span>订单已超时，请重新预订</span>
            </div>
          )}
        </div>

        {/* Hotel Info */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex gap-4 mb-4" onClick={() => navigate(`/hotel/${booking.hotelId}`)}>
            <img
              src={booking.hotelImage}
              alt={booking.hotelName}
              className="w-20 h-20 object-cover rounded-xl bg-slate-100"
            />
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h3 className="font-bold text-lg text-slate-900 truncate">
                {i18n.language === 'en'
                  ? (booking.hotelNameEn || booking.hotelName)
                  : (booking.hotelNameCn || booking.hotelName)}
              </h3>
              <div className="text-sm text-slate-500 mt-1">{booking.roomType}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl">
            <div>
              <div className="text-xs text-slate-400 mb-0.5">{t('home.check_in')}</div>
              <div className="font-bold text-slate-800 text-lg">{formatDate(new Date(booking.checkIn), 'MM-dd')}</div>
              <div className="text-xs text-slate-500">{formatDate(new Date(booking.checkIn), 'EEE')}</div>
            </div>
            <div className="pl-4 border-l border-slate-200/60">
              <div className="text-xs text-slate-400 mb-0.5">{t('home.check_out')}</div>
              <div className="font-bold text-slate-800 text-lg">{formatDate(new Date(booking.checkOut), 'MM-dd')}</div>
              <div className="text-xs text-slate-500">{formatDate(new Date(booking.checkOut), 'EEE')}</div>
            </div>
          </div>
        </div>

        {/* Guest Info */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <h4 className="font-bold text-slate-900 mb-4">{t('booking.guest_info')}</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-slate-500">
                <User size={16} className="mr-2" />
                <span>入住人</span>
              </div>
              <span className="text-slate-900 font-medium">{booking.guestName}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-slate-500">
                <Phone size={16} className="mr-2" />
                <span>联系电话</span>
              </div>
              <span className="text-slate-900 font-medium">{booking.guestPhone}</span>
            </div>
          </div>
        </div>

        {/* Order Info */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] mb-4">
          <h4 className="font-bold text-slate-900 mb-4">{t('booking.order_info')}</h4>
          <div className="space-y-3 pl-1 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">{t('booking.order_no')}</span>
              <span className="text-slate-900 flex items-center font-mono text-xs bg-slate-50 px-2 py-1 rounded-md">
                {booking.id.toUpperCase()}
                <Copy size={12} className="ml-2 text-slate-400 active:text-blue-500 transition-colors" onClick={() => {
                  navigator.clipboard.writeText(booking.id.toUpperCase());
                  Toast.show(t('common.copied'));
                }} />
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">{t('booking.create_time')}</span>
              <span className="text-slate-900">{formatDate(new Date(booking.createdAt), 'yyyy-MM-dd HH:mm')}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-2">
              <span className="text-slate-900 font-bold">{t('booking.total_price')}</span>
              <span className="text-blue-600 text-xl font-bold">{formatCurrency(booking.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      {isPending && !isExpired && (
        <div className="bg-white p-4 border-t border-slate-100 flex gap-4 safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
          <div className="flex-1">
            <span className="text-xs text-slate-500 mr-1">合计:</span>
            <span className="text-lg font-bold text-blue-600">{formatCurrency(booking.totalPrice)}</span>
          </div>
          <div className="flex gap-2">
            <Button
              shape='rounded'
              onClick={handleCancel}
              disabled={cancelling || paying}
              className="bg-white border-slate-200 text-slate-600 font-medium px-5"
            >
              {cancelling ? '取消中...' : t('booking.actions.cancel')}
            </Button>
            <Button
              color='primary'
              shape='rounded'
              onClick={() => setShowPayment(true)}
              disabled={cancelling || paying}
              className="bg-blue-600 font-medium px-6 shadow-sm"
            >
              {t('booking.actions.pay')}
            </Button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        visible={showPayment}
        amount={booking.totalPrice}
        onClose={() => setShowPayment(false)}
        onConfirm={handlePayment}
        loading={paying}
      />
    </div>
  );
};

export default BookingDetail;

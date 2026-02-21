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
  const { t } = useTranslation();
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'success';
      case 'completed': return 'primary';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-500';
      case 'confirmed': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const isPending = booking.status === 'pending';
  const canCancel = isPending && !isExpired;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col pb-safe">
      <NavBar onBack={() => navigate(-1)} backArrow={<ChevronLeft size={24} />}>
        {t('booking.detail_title')}
      </NavBar>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Status Card with Countdown */}
        <div className={`${getStatusBgColor(booking.status)} text-white p-6 rounded-xl -mt-2 shadow-md`}>
            <div className="text-xl font-bold mb-1">
                {t(`booking.status.${booking.status}`)}
            </div>
            <div className="text-white/80 text-sm mb-3">
                {isExpired ? '订单已超时取消' : t(`booking.status_desc.${booking.status}`)}
            </div>

            {/* 倒计时 */}
            {isPending && !isExpired && (
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} />
                    <span>支付剩余时间</span>
                  </div>
                  <div className="font-mono font-bold text-lg">{formattedTime}</div>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-1000"
                    style={{
                      width: `${((15 * 60 - parseInt(formattedTime.split(':')[0]) * 60 - parseInt(formattedTime.split(':')[1])) / (15 * 60)) * 100}%`
                    }}
                  />
                </div>
              </div>
            )}

            {/* 过期提示 */}
            {isPending && isExpired && (
              <div className="flex items-center gap-2 text-sm bg-white/10 rounded-lg p-3">
                <AlertCircle size={16} />
                <span>订单已超时，请重新预订</span>
              </div>
            )}
        </div>

        {/* Hotel Info */}
        <Card className="rounded-xl">
            <div className="flex gap-3 mb-3" onClick={() => navigate(`/hotel/${booking.hotelId}`)}>
                <img
                    src={booking.hotelImage}
                    alt={booking.hotelName}
                    className="w-20 h-20 object-cover rounded-lg bg-gray-200"
                />
                <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{booking.hotelName}</h3>
                    <div className="text-sm text-gray-500 mt-1">{booking.roomType}</div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg">
                <div>
                    <div className="text-xs text-gray-400">{t('home.check_in')}</div>
                    <div className="font-bold text-gray-800 text-lg">{formatDate(new Date(booking.checkIn), 'MM-dd')}</div>
                    <div className="text-xs text-gray-500">{formatDate(new Date(booking.checkIn), 'EEE')}</div>
                </div>
                <div>
                    <div className="text-xs text-gray-400">{t('home.check_out')}</div>
                    <div className="font-bold text-gray-800 text-lg">{formatDate(new Date(booking.checkOut), 'MM-dd')}</div>
                    <div className="text-xs text-gray-500">{formatDate(new Date(booking.checkOut), 'EEE')}</div>
                </div>
            </div>
        </Card>

        {/* Guest Info */}
        <Card title={t('booking.guest_info')} className="rounded-xl">
            <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                    <User size={18} className="mr-3 text-gray-400" />
                    <span>{booking.guestName}</span>
                </div>
                <div className="flex items-center text-gray-700">
                    <Phone size={18} className="mr-3 text-gray-400" />
                    <span>{booking.guestPhone}</span>
                </div>
            </div>
        </Card>

        {/* Order Info */}
        <Card title={t('booking.order_info')} className="rounded-xl">
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500">{t('booking.order_no')}</span>
                    <span className="text-gray-900 flex items-center">
                        {booking.id.toUpperCase()}
                        <Copy size={14} className="ml-2 text-blue-500" onClick={() => {
                          navigator.clipboard.writeText(booking.id.toUpperCase());
                          Toast.show(t('common.copied'));
                        }} />
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">{t('booking.create_time')}</span>
                    <span className="text-gray-900">{formatDate(new Date(booking.createdAt), 'yyyy-MM-dd HH:mm')}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
                    <span className="text-gray-900 font-bold">{t('booking.total_price')}</span>
                    <span className="text-blue-600 text-xl font-bold">{formatCurrency(booking.totalPrice)}</span>
                </div>
            </div>
        </Card>
      </div>

      {/* Footer Actions */}
      {isPending && !isExpired && (
        <div className="bg-white p-4 border-t border-gray-100 flex gap-3 safe-area-bottom">
            <Button
              block
              shape='rounded'
              onClick={handleCancel}
              disabled={cancelling || paying}
            >
              {cancelling ? '取消中...' : t('booking.actions.cancel')}
            </Button>
            <Button
              block
              color='primary'
              shape='rounded'
              onClick={() => setShowPayment(true)}
              disabled={cancelling || paying}
            >
              {t('booking.actions.pay')}
            </Button>
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

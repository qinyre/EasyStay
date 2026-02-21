import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, PullToRefresh, ErrorBlock, Dialog, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { getBookings, cancelBooking, updateBookingStatus } from '../../services/api';
import { Booking } from '../../types';
import { BookingCard } from '../../components/BookingCard';
import { PaymentModal } from '../../components/PaymentModal';

const Bookings: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [payingBookingId, setPayingBookingId] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBookings(activeTab === 'all' ? undefined : activeTab);
      setBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancelBooking = async (bookingId: string, e: React.MouseEvent) => {
    e?.stopPropagation();

    const result = await Dialog.confirm({
      content: t('booking.cancel_confirm'),
      confirmText: t('common.confirm'),
      cancelText: t('common.cancel'),
    });

    if (result) {
      try {
        await cancelBooking(bookingId);
        Toast.show({
          content: t('booking.cancel_success'),
          icon: 'success',
        });
        await fetchBookings();
      } catch (error) {
        console.error('Cancel booking error:', error);
        Toast.show({
          content: t('booking.cancel_failed'),
          icon: 'fail',
        });
      }
    }
  };

  const handlePayClick = (booking: Booking, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedBooking(booking);
    setShowPayment(true);
  };

  const handlePayment = async (method: string) => {
    if (!selectedBooking) return;

    setPayingBookingId(selectedBooking.id);
    try {
      // 模拟支付过程
      console.log('Payment method:', method);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 更新订单状态
      await updateBookingStatus(selectedBooking.id, 'confirmed');

      Toast.show({
        content: t('booking.messages.pay_success'),
        icon: 'success',
        duration: 1500,
      });

      setShowPayment(false);

      // 直接跳转到订单详情页
      setTimeout(() => {
        navigate(`/booking/${selectedBooking.id}`);
      }, 500);

      await fetchBookings();
    } catch (error) {
      console.error('Payment error:', error);
      Toast.show({
        content: t('booking.messages.pay_failed'),
        icon: 'fail',
      });
    } finally {
      setPayingBookingId(null);
      setSelectedBooking(null);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="p-4 pb-2 font-bold text-lg text-gray-900">{t('booking.title')}</div>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.Tab title={t('booking.tabs.all')} key='all' />
          <Tabs.Tab title={t('booking.tabs.pending')} key='pending' />
          <Tabs.Tab title={t('booking.tabs.confirmed')} key='confirmed' />
          <Tabs.Tab title={t('booking.tabs.cancelled')} key='cancelled' />
        </Tabs>
      </div>

      <div className="flex-1 overflow-y-auto">
        <PullToRefresh onRefresh={fetchBookings}>
          <div className="p-4 space-y-4">
            {bookings.length === 0 && !loading ? (
              <ErrorBlock status='empty' title={t('booking.empty')} description={t('booking.empty_desc')} />
            ) : (
              bookings.map(booking => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onClick={() => navigate(`/booking/${booking.id}`)}
                  onCancel={(e) => handleCancelBooking(booking.id, e)}
                  onPay={handlePayClick}
                  paying={payingBookingId === booking.id}
                />
              ))
            )}
            <div className="h-safe-bottom" />
          </div>
        </PullToRefresh>
      </div>

      {/* 支付弹窗 */}
      <PaymentModal
        visible={showPayment}
        amount={selectedBooking?.totalPrice ?? 0}
        onClose={() => {
          setShowPayment(false);
          setSelectedBooking(null);
        }}
        onConfirm={handlePayment}
        loading={payingBookingId !== null}
      />
    </div>
  );
};

export default Bookings;

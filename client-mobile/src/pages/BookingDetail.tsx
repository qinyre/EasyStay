import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NavBar, Card, Button, Dialog, Toast } from 'antd-mobile';
import { ChevronLeft, Phone, User, Copy } from 'lucide-react';
import { getBookingById } from '../services/api';
import { Booking } from '../types';
import { formatCurrency, formatDate } from '../utils/format';

const BookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (id) {
      getBookingById(id).then(setBooking);
    }
  }, [id]);

  if (!booking) return <div>{t('common.loading')}</div>;

  const handleCancel = async () => {
    const result = await Dialog.confirm({
      content: t('booking.cancel_confirm'),
    });
    if (result) {
      Toast.show({ icon: 'success', content: t('booking.cancel_success') });
      // In a real app, call cancel API here and refresh data
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'success';
      case 'completed': return 'primary';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  console.log(getStatusColor(booking.status)); // Usage to avoid error

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col pb-safe">
      <NavBar onBack={() => navigate(-1)} backArrow={<ChevronLeft size={24} />}>
        {t('booking.detail_title')}
      </NavBar>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Status Card */}
        <div className="bg-blue-600 text-white p-6 rounded-xl -mt-2 shadow-md">
            <div className="text-xl font-bold mb-1">
                {t(`booking.status.${booking.status}`)}
            </div>
            <div className="text-blue-100 text-sm">
                {t(`booking.status_desc.${booking.status}`)}
            </div>
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
                        <Copy size={14} className="ml-2 text-blue-500" onClick={() => Toast.show(t('common.copied'))} />
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
      {booking.status === 'pending' && (
        <div className="bg-white p-4 border-t border-gray-100 flex gap-3 safe-area-bottom">
            <Button block shape='rounded' onClick={handleCancel}>
                {t('booking.actions.cancel')}
            </Button>
            <Button block color='primary' shape='rounded'>
                {t('booking.actions.pay')}
            </Button>
        </div>
      )}
    </div>
  );
};

export default BookingDetail;

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, Card, Tag, Button, PullToRefresh, ErrorBlock } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { getBookings } from '../../services/api';
import { Booking } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';

const Bookings: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getBookings(activeTab === 'all' ? undefined : activeTab);
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'success';
      case 'completed': return 'primary';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    return t(`booking.status.${status}`, status);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="p-4 pb-2 font-bold text-lg text-gray-900">{t('tab.bookings')}</div>
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
                <Card 
                    key={booking.id} 
                    className="rounded-xl shadow-sm active:opacity-80 transition-opacity"
                    onClick={() => navigate(`/booking/${booking.id}`)}
                >
                  <div className="flex gap-3">
                    <img 
                        src={booking.hotelImage} 
                        alt={booking.hotelName} 
                        className="w-24 h-24 object-cover rounded-lg bg-gray-200"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-gray-900 truncate pr-2">{booking.hotelName}</h3>
                            <Tag color={getStatusColor(booking.status)}>
                                {getStatusText(booking.status)}
                            </Tag>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{booking.roomType}</p>
                        <p className="text-xs text-gray-400 mt-1">
                            {formatDate(new Date(booking.checkIn), 'MM-dd')} - {formatDate(new Date(booking.checkOut), 'MM-dd')}
                        </p>
                      </div>
                      <div className="text-right font-bold text-blue-600">
                        {formatCurrency(booking.totalPrice)}
                      </div>
                    </div>
                  </div>
                  {booking.status === 'pending' && (
                      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end gap-2">
                          <Button size='mini' shape='rounded' onClick={(e) => { e.stopPropagation(); /* Cancel logic */ }}>
                            {t('booking.actions.cancel')}
                          </Button>
                          <Button size='mini' shape='rounded' color='primary' onClick={(e) => { e.stopPropagation(); /* Pay logic */ }}>
                            {t('booking.actions.pay')}
                          </Button>
                      </div>
                  )}
                </Card>
              ))
            )}
            <div className="h-safe-bottom" />
          </div>
        </PullToRefresh>
      </div>
    </div>
  );
};

export default Bookings;

import React, { useMemo } from 'react';
import { Card, Tag, Button } from 'antd-mobile';
import { useTranslation } from 'react-i18next';
import { Clock } from 'lucide-react';
import { Booking } from '../types';
import { formatCurrency, formatDate } from '../utils/format';
import { useCountdown } from '../hooks/useCountdown';

interface BookingCardProps {
  booking: Booking;
  onClick: () => void;
  onCancel: (e: React.MouseEvent) => void;
  onPay: (booking: Booking, e: React.MouseEvent) => void;
  paying?: boolean;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onClick,
  onCancel,
  onPay,
  paying = false,
}) => {
  const { i18n } = useTranslation();

  // 计算剩余时间
  const remainingMinutes = useMemo(() => {
    if (booking.status !== 'pending') return 0;

    const createdTime = new Date(booking.createdAt);
    const now = new Date();
    const elapsedMinutes = (now.getTime() - createdTime.getTime()) / (1000 * 60);
    return Math.max(0, 15 - elapsedMinutes);
  }, [booking.status, booking.createdAt]);

  const countdown = useCountdown({
    minutes: remainingMinutes,
    onExpire: () => onCancel({ stopPropagation: () => { } } as React.MouseEvent),
    autoStart: booking.status === 'pending' && remainingMinutes > 0,
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return { background: '#fff7ed', color: '#c2410c', borderColor: '#ffedd5' }; // orange-50, orange-700
      case 'confirmed': return { background: '#f0fdf4', color: '#15803d', borderColor: '#dcfce7' }; // green-50, green-700
      case 'completed': return { background: '#eff6ff', color: '#1d4ed8', borderColor: '#dbeafe' }; // blue-50, blue-700
      case 'cancelled': return { background: '#f8fafc', color: '#64748b', borderColor: '#f1f5f9' }; // slate-50, slate-500
      default: return { background: '#f8fafc', color: '#64748b', borderColor: '#f1f5f9' };
    }
  };

  const isExpired = countdown.isExpired;
  const isPending = booking.status === 'pending' && !isExpired;

  return (
    <Card
      className="rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 active:opacity-70 transition-opacity duration-150"
      onClick={onClick}
      bodyClassName="p-3"
    >
      <div className="flex gap-3">
        <img
          src={booking.hotelImage}
          alt={booking.hotelName}
          className="w-24 h-24 object-cover rounded-xl bg-slate-100"
        />
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-bold text-slate-900 truncate text-base">
                {i18n.language === 'en'
                  ? (booking.hotelNameEn || booking.hotelName)
                  : (booking.hotelNameCn || booking.hotelName)}
              </h3>
              <div
                className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap flex-shrink-0"
                style={getStatusStyle(booking.status)}
              >
                {booking.status === 'pending' && isExpired ? '已超时' :
                  booking.status === 'pending' ? '待支付' :
                    booking.status === 'confirmed' ? '已确认' :
                      booking.status === 'completed' ? '已完成' : '已取消'}
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-1">{booking.roomType}</p>
            <p className="text-xs text-slate-400 mt-1 tracking-wide">
              {formatDate(new Date(booking.checkIn), 'MM-dd')} - {formatDate(new Date(booking.checkOut), 'MM-dd')}
            </p>
          </div>
          <div className="text-right font-bold text-blue-600 text-lg">
            {formatCurrency(booking.totalPrice)}
          </div>
        </div>
      </div>

      {/* 倒计时显示 */}
      {booking.status === 'pending' && remainingMinutes > 0 && !isExpired && (
        <div className="mt-4">
          <div className="flex items-center justify-between bg-orange-50/80 rounded-xl p-2.5 px-3">
            <div className="flex items-center gap-2 text-orange-700 text-sm font-medium">
              <Clock size={16} />
              <span>支付剩余</span>
            </div>
            <span className="font-mono font-bold text-orange-600 tracking-wider">{countdown.formattedTime}</span>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      {isPending && (
        <div className="mt-4 flex justify-end gap-3">
          <Button
            size='small'
            shape='rounded'
            onClick={onCancel}
            className="border-slate-200 text-slate-600 whitespace-nowrap px-4 bg-white"
          >
            取消
          </Button>
          <Button
            size='small'
            shape='rounded'
            color='primary'
            onClick={(e) => onPay(booking, e)}
            loading={paying}
            className="whitespace-nowrap px-5 bg-blue-600 font-medium"
          >
            {paying ? '支付中...' : '立即支付'}
          </Button>
        </div>
      )}
    </Card>
  );
};

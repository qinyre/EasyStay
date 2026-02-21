import React, { useMemo } from 'react';
import { Card, Tag, Button } from 'antd-mobile';
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
    onExpire: () => onCancel({ stopPropagation: () => {} } as React.MouseEvent),
    autoStart: booking.status === 'pending' && remainingMinutes > 0,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'success';
      case 'completed': return 'primary';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const isExpired = countdown.isExpired;
  const isPending = booking.status === 'pending' && !isExpired;

  return (
    <Card
      className="rounded-xl shadow-sm active:opacity-80 transition-opacity"
      onClick={onClick}
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
                {booking.status === 'pending' && isExpired ? '已超时' :
                 booking.status === 'pending' ? '待支付' :
                 booking.status === 'confirmed' ? '已确认' :
                 booking.status === 'completed' ? '已完成' : '已取消'}
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

      {/* 倒计时显示 */}
      {booking.status === 'pending' && remainingMinutes > 0 && !isExpired && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between bg-orange-50 rounded-lg p-2">
            <div className="flex items-center gap-2 text-orange-700 text-sm">
              <Clock size={14} />
              <span>支付剩余</span>
            </div>
            <span className="font-mono font-bold text-orange-600">{countdown.formattedTime}</span>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      {isPending && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end gap-2">
          <Button
            size='mini'
            shape='rounded'
            onClick={onCancel}
          >
            取消
          </Button>
          <Button
            size='mini'
            shape='rounded'
            color='primary'
            onClick={(e) => onPay(booking, e)}
            loading={paying}
          >
            {paying ? '支付中...' : '立即支付'}
          </Button>
        </div>
      )}
    </Card>
  );
};

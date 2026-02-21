import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, FileText, MapPin } from 'lucide-react';
import { Button } from 'antd-mobile';
import { useTranslation } from 'react-i18next';

const BookingSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const bookingData = location.state as {
    bookingId?: string;
    hotelName?: string;
    totalPrice?: number;
  } | null;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Success Animation */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="relative mb-6">
          {/* Animated check circle */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle size={48} className="text-green-500" />
          </div>
          {/* Ripple effect */}
          <div className="absolute inset-0 bg-green-400 rounded-full opacity-20 animate-ping" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('booking.success_title')}</h1>
        <p className="text-gray-500 text-center mb-8">
          您的预订已确认，预订信息已发送至您的手机
        </p>

        {/* Booking Summary Card */}
        <div className="w-full bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 text-sm">{t('booking.order_no')}</span>
            <span className="font-mono font-bold text-gray-900">
              {bookingData?.bookingId || 'ES202402210001'}
            </span>
          </div>

          {bookingData?.hotelName && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <MapPin size={18} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-900">{bookingData.hotelName}</div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-gray-900 font-bold">{t('booking.total_price')}</span>
            <span className="text-2xl font-bold text-blue-600">
              ¥{bookingData?.totalPrice || '0'}
            </span>
          </div>
        </div>

        {/* Info Cards */}
        <div className="w-full space-y-3 mb-8">
          <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FileText size={18} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-900 text-sm mb-1">电子确认单</div>
              <div className="text-xs text-gray-500">
                已发送至您的手机，入住时请出示
              </div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-4">
            <div className="text-xs text-amber-800 leading-relaxed">
              <span className="font-bold">温馨提示：</span>
              请在入住当天14:00后办理入住，退房时间为次日12:00前。如有疑问请联系客服400-888-8888。
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white border-t border-gray-100 p-4 space-y-3 safe-area-bottom">
        <Button
          block
          color="primary"
          size="large"
          onClick={() => navigate(`/booking/${bookingData?.bookingId || 'latest'}`)}
        >
          查看订单详情
        </Button>
        <Button
          block
          size="large"
          onClick={() => navigate('/bookings')}
        >
          查看我的订单
        </Button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-bounce {
          animation: bounce 1s ease-in-out;
        }
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default BookingSuccess;

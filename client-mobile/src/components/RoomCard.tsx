import React from 'react';
import { Button, Card, Image } from 'antd-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import { Room } from '../types';
import { formatCurrency } from '../utils/format';
import { useAuth } from '../contexts/AuthContext';

interface RoomCardProps {
  room: Room;
  nights?: number;
  onBook: () => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, nights = 1, onBook }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const totalPrice = room.price * nights;

  return (
    <Card className="mb-3 rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-all" bodyStyle={{ padding: 12 }}>
      <div className="flex">
        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
          <Image src={room.image} alt={room.type} fit="cover" className="w-full h-full" />
        </div>
        <div className="ml-3 flex-1 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-900 text-sm">{room.type}</h4>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{room.description}</p>
          </div>
          <div className="flex justify-between items-end mt-2">
            <div>
              <div className="text-sm text-slate-400">{nights > 1 ? `${nights}晚总价` : '每晚'}</div>
              <div className="text-lg font-bold text-blue-600">{formatCurrency(totalPrice)}</div>
              {nights > 1 && <div className="text-xs text-slate-400">¥{room.price}/晚</div>}
            </div>
            <Button
              color='primary'
              size='mini'
              onClick={(e) => {
                e.stopPropagation();
                if (!isAuthenticated) {
                  navigate('/login', { state: { from: location.pathname } });
                } else {
                  onBook();
                }
              }}
              className="font-bold px-4 rounded-xl shadow-sm active:scale-95 transition-transform"
            >
              预订
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

import React from 'react';
import { Button, Card, Image } from 'antd-mobile';
import { Room } from '../types';
import { formatCurrency } from '../utils/format';

interface RoomCardProps {
  room: Room;
  onBook: () => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onBook }) => {
  return (
    <Card className="mb-3 rounded-lg border border-gray-100 shadow-sm" bodyStyle={{ padding: 12 }}>
      <div className="flex">
        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
          <Image src={room.image} alt={room.type} fit="cover" className="w-full h-full" />
        </div>
        <div className="ml-3 flex-1 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-gray-900 text-sm">{room.type}</h4>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{room.description}</p>
          </div>
          <div className="flex justify-between items-end mt-2">
            <div className="text-lg font-bold text-blue-600">{formatCurrency(room.price)}</div>
            <Button 
                color='primary' 
                size='mini' 
                onClick={onBook}
                className="font-bold px-4 rounded-lg"
            >
                Book
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

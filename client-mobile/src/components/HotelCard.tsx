import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { Card, Tag } from 'antd-mobile';
import { Hotel } from '../types';
import { formatCurrency } from '../utils/format';

export interface HotelCardProps {
  hotel: Hotel;
  onClick: () => void;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, onClick }) => {
  return (
    <Card 
      className="mb-4 shadow-sm rounded-xl overflow-hidden p-0"
      onClick={onClick}
      bodyStyle={{ padding: 0 }}
    >
      <div className="relative h-40">
        <img 
          src={hotel.image} 
          alt={hotel.name_cn} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center">
          <Star size={12} className="fill-yellow-400 text-yellow-400 mr-1" />
          {hotel.rating}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{hotel.name_cn}</h3>
                <h4 className="text-xs text-gray-500 line-clamp-1">{hotel.name_en}</h4>
            </div>
        </div>
        
        <div className="flex items-center text-gray-500 text-xs mt-2">
            <MapPin size={12} className="mr-1" />
            <span className="line-clamp-1">{hotel.location.address}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-3">
            {hotel.tags?.map((tag) => (
                <Tag key={tag} color='primary' fill='outline' className="text-[10px] px-2 py-0.5 rounded-full">
                    {tag}
                </Tag>
            ))}
        </div>
        
        <div className="flex justify-between items-end mt-4">
            <div className="text-xs text-gray-400">
                {hotel.star_level} Star Hotel
            </div>
            <div className="flex items-baseline">
                <span className="text-xs text-gray-500 mr-1">from</span>
                <span className="text-lg font-bold text-blue-600">{formatCurrency(hotel.price_start || 0)}</span>
            </div>
        </div>
      </div>
    </Card>
  );
};

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Dropdown, InfiniteScroll, NavBar, PullToRefresh, List } from 'antd-mobile';
import { getHotels } from '../services/api';
import { Hotel } from '../types';
import { HotelCard } from '../components/HotelCard';
import { useTranslation } from 'react-i18next';

const HotelList: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Filter state
  const city = searchParams.get('city') || '';
  const keyword = searchParams.get('keyword') || '';

  const loadMore = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const nextPage = page + 1;
      const newHotels = await getHotels({ city, keyword, page: nextPage });

      if (newHotels.length === 0) {
        setHasMore(false);
      } else {
        setHotels(val => [...val, ...newHotels]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('加载更多酒店失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    const loadInitial = async () => {
      try {
        setLoading(true);
        const data = await getHotels({ city, keyword, page: 1 });
        setHotels(data);
        setPage(1);
        setHasMore(data.length > 0);
      } catch (error) {
        console.error('加载酒店列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitial();
  }, [city, keyword]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 shadow-sm">
        <NavBar 
            onBack={() => navigate(-1)}
            backArrow={<ChevronLeft size={24} />}
        >
            <div className="text-sm font-normal">
                <div className="font-bold text-gray-900">{city || t('hotelList.all_cities')}</div>
                <div className="text-xs text-gray-500">
                    {searchParams.get('checkIn') ? `${searchParams.get('checkIn')} - ${searchParams.get('checkOut')}` : t('hotelList.any_dates')}
                </div>
            </div>
        </NavBar>
        
        {/* Filter Bar using Antd Mobile Dropdown */}
        <Dropdown>
          <Dropdown.Item key='sorter' title={t('hotelList.sort')}>
            <div style={{ padding: 12 }}>
              <List>
                <List.Item onClick={() => {
                  const sorted = [...hotels].sort((a, b) => b.rating - a.rating);
                  setHotels(sorted);
                }}>{t('hotelList.recommended')}</List.Item>
                <List.Item onClick={() => {
                  const sorted = [...hotels].sort((a, b) => (a.price_start || 0) - (b.price_start || 0));
                  setHotels(sorted);
                }}>{t('hotelList.price_low_high')}</List.Item>
                <List.Item onClick={() => {
                  const sorted = [...hotels].sort((a, b) => (b.price_start || 0) - (a.price_start || 0));
                  setHotels(sorted);
                }}>{t('hotelList.price_high_low')}</List.Item>
                <List.Item onClick={() => {
                  const sorted = [...hotels].sort((a, b) => b.rating - a.rating);
                  setHotels(sorted);
                }}>{t('hotelList.rating')}</List.Item>
              </List>
            </div>
          </Dropdown.Item>
          <Dropdown.Item key='price' title={t('hotelList.price')}>
            <div style={{ padding: 12 }}>
              <div className="p-4 text-center text-gray-500">{t('hotelList.price_placeholder')}</div>
            </div>
          </Dropdown.Item>
          <Dropdown.Item key='more' title={t('hotelList.more')}>
            <div style={{ padding: 12 }}>
               <div className="p-4 text-center text-gray-500">{t('hotelList.more_placeholder')}</div>
            </div>
          </Dropdown.Item>
        </Dropdown>
      </div>

      {/* List */}
      <div className="flex-1">
        <PullToRefresh
          onRefresh={async () => {
            const data = await getHotels({ city, keyword });
            setHotels(data);
            setHasMore(true);
          }}
        >
            <div className="p-4">
                {hotels.map((hotel) => (
                    <HotelCard 
                        key={hotel.id} 
                        hotel={hotel} 
                        onClick={() => navigate(`/hotel/${hotel.id}`)} 
                    />
                ))}
            </div>
            
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
        </PullToRefresh>
      </div>
    </div>
  );
};

export default HotelList;

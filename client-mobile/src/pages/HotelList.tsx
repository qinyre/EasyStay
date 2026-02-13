import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Dropdown, InfiniteScroll, NavBar, PullToRefresh, List } from 'antd-mobile';
import { getHotels } from '../services/api';
import { Hotel } from '../types';
import { HotelCard } from '../components/HotelCard';

const HotelList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [hasMore, setHasMore] = useState(true);
  
  // Filter state
  const city = searchParams.get('city') || '';
  const keyword = searchParams.get('keyword') || '';

  const loadMore = async () => {
    // Simulate pagination
    if (hotels.length > 20) {
      setHasMore(false);
      return;
    }
    
    // In a real app, you would pass page/offset
    const newHotels = await getHotels({ city, keyword });
    // Simulate adding unique IDs to avoid key conflicts in this mock
    const mockedMore = newHotels.map(h => ({ ...h, id: `${h.id}-${Date.now()}-${Math.random()}` }));
    
    setHotels(val => [...val, ...mockedMore]);
  };

  // Initial load
  useEffect(() => {
    getHotels({ city, keyword }).then((data) => {
      setHotels(data);
    });
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
                <div className="font-bold text-gray-900">{city || 'All Cities'}</div>
                <div className="text-xs text-gray-500">
                    {searchParams.get('checkIn') ? `${searchParams.get('checkIn')} - ${searchParams.get('checkOut')}` : 'Any Dates'}
                </div>
            </div>
        </NavBar>
        
        {/* Filter Bar using Antd Mobile Dropdown */}
        <Dropdown>
          <Dropdown.Item key='sorter' title='Sort'>
            <div style={{ padding: 12 }}>
              <List>
                <List.Item onClick={() => {}}>Recommended</List.Item>
                <List.Item onClick={() => {}}>Price: Low to High</List.Item>
                <List.Item onClick={() => {}}>Price: High to Low</List.Item>
                <List.Item onClick={() => {}}>Rating</List.Item>
              </List>
            </div>
          </Dropdown.Item>
          <Dropdown.Item key='price' title='Price'>
            <div style={{ padding: 12 }}>
              <div className="p-4 text-center text-gray-500">Price Range Slider Placeholder</div>
            </div>
          </Dropdown.Item>
          <Dropdown.Item key='more' title='More'>
            <div style={{ padding: 12 }}>
               <div className="p-4 text-center text-gray-500">More Filters Placeholder</div>
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

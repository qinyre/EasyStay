import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Search, Star } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { Button, Card, DatePicker, Form, Input, Swiper, Toast, Image } from 'antd-mobile';
import { getPopularCities } from '../services/api';

import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [popularCities, setPopularCities] = useState<{ name: string; image: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Search state
  const [city, setCity] = useState('Shanghai');
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: addDays(new Date(), 1),
  });
  const [keyword, setKeyword] = useState('');
  
  // DatePicker visibility
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    getPopularCities().then((data) => {
      setPopularCities(data);
      setLoading(false);
    });
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    if (keyword) params.append('keyword', keyword);
    params.append('checkIn', format(dateRange.start, 'yyyy-MM-dd'));
    params.append('checkOut', format(dateRange.end, 'yyyy-MM-dd'));
    
    navigate(`/hotels?${params.toString()}`);
  };

  const banners = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  ];

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Top Banner Swiper */}
      <div className="h-48">
        <Swiper autoplay loop>
          {banners.map((url, index) => (
            <Swiper.Item key={index}>
              <div className="h-48 relative">
                <Image src={url} fit="cover" className="w-full h-full" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 flex items-end p-6">
                  <h1 className="text-white text-2xl font-bold drop-shadow-md">{t('home.title')}</h1>
                </div>
              </div>
            </Swiper.Item>
          ))}
        </Swiper>
      </div>

      {/* Search Box - Overlapping the banner */}
      <div className="px-4 -mt-4 relative z-10">
        <Card className="shadow-lg rounded-xl">
          <Form layout='horizontal' footer={
            <Button block color='primary' size='large' onClick={handleSearch}>
              {t('home.search_btn')}
            </Button>
          }>
            <Form.Item
              label={<MapPin className="text-blue-500" size={20} />}
              onClick={() => {}} // Could open a city selector
            >
              <Input 
                placeholder={t('home.search_placeholder')}
                value={city} 
                onChange={val => setCity(val)} 
                clearable
              />
            </Form.Item>
            
            <Form.Item
              label={<Calendar className="text-blue-500" size={20} />}
            >
              <div className="flex justify-between items-center w-full" onClick={() => setShowStartPicker(true)}>
                <div className="flex-1">
                  <div className="text-xs text-gray-400">{t('home.check_in')}</div>
                  <div className="font-medium text-base">{format(dateRange.start, 'MM-dd')}</div>
                </div>
                <div className="px-4 text-gray-300">|</div>
                <div className="flex-1" onClick={(e) => { e.stopPropagation(); setShowEndPicker(true); }}>
                  <div className="text-xs text-gray-400">{t('home.check_out')}</div>
                  <div className="font-medium text-base">{format(dateRange.end, 'MM-dd')}</div>
                </div>
              </div>
            </Form.Item>

            <Form.Item
              label={<Search className="text-blue-500" size={20} />}
            >
              <Input 
                placeholder="Keyword (Optional)" 
                value={keyword} 
                onChange={val => setKeyword(val)} 
                clearable
              />
            </Form.Item>
          </Form>
        </Card>
      </div>

      <DatePicker
        visible={showStartPicker}
        onClose={() => setShowStartPicker(false)}
        min={new Date()}
        onConfirm={val => {
          setDateRange(prev => ({ ...prev, start: val }));
        }}
      />
      
      <DatePicker
        visible={showEndPicker}
        onClose={() => setShowEndPicker(false)}
        min={dateRange.start}
        onConfirm={val => {
          setDateRange(prev => ({ ...prev, end: val }));
        }}
      />

      {/* Popular Cities */}
      <div className="mt-8 px-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Star className="text-yellow-500 fill-current" size={18} />
          {t('home.popular_destinations')}
        </h2>
        
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
          {loading ? (
             Array(4).fill(0).map((_, i) => (
               <div key={i} className="w-32 h-40 bg-gray-200 rounded-lg animate-pulse flex-shrink-0" />
             ))
          ) : (
            popularCities.map((cityItem) => (
              <div 
                key={cityItem.name} 
                className="relative w-32 h-40 rounded-lg overflow-hidden flex-shrink-0 snap-start shadow-sm active:opacity-80 transition-opacity"
                onClick={() => {
                    setCity(cityItem.name);
                    Toast.show(`Selected ${cityItem.name}`);
                }}
              >
                <Image src={cityItem.image} fit="cover" className="w-full h-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                  <span className="text-white font-bold text-sm">{cityItem.name}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Features */}
      <div className="mt-4 px-4 pb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">{t('home.why_choose_us')}</h2>
        <div className="grid grid-cols-2 gap-3">
            <Card className="bg-blue-50 border-none shadow-none">
                <div className="font-bold text-blue-700 text-sm mb-1">{t('home.best_price')}</div>
                <div className="text-xs text-blue-500">{t('home.best_price_desc')}</div>
            </Card>
            <Card className="bg-green-50 border-none shadow-none">
                <div className="font-bold text-green-700 text-sm mb-1">{t('home.support')}</div>
                <div className="text-xs text-green-500">{t('home.support_desc')}</div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Search, Star, Navigation, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { Button, Card, Form, Input, Toast } from 'antd-mobile';
import { getPopularCities } from '../services/api';
import { getCurrentCityWithFallback } from '../services/geolocation';
import { CalendarPicker } from '../components/CalendarPicker';
import { CityPicker } from '../components/CityPicker';
import OptimizedImage from '../components/OptimizedImage';
import OptimizedSwiper from '../components/OptimizedSwiper';
import { useTranslation } from 'react-i18next';
import { useSearch } from '../contexts/SearchContext';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { city, setCity, dateRange, setDateRange, keyword, setKeyword } = useSearch();
  const [popularCities, setPopularCities] = useState<{ name: string; image: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);

  // Calendar visibility
  const [showCalendar, setShowCalendar] = useState(false);

  // City picker visibility
  const [showCityPicker, setShowCityPicker] = useState(false);

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

  const handleLocation = async () => {
    setLocating(true);
    try {
      const currentCity = await getCurrentCityWithFallback();
      setCity(currentCity);
      Toast.show({ content: `已定位到：${currentCity}`, duration: 1000 });
    } catch {
      Toast.show({ content: '定位失败，请手动选择城市', duration: 1000 });
    } finally {
      setLocating(false);
    }
  };

  const banners = [
    // 优化图片 URL - 更大尺寸，更好质量，WebP 格式
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=75&fm=webp",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=75&fm=webp",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=75&fm=webp"
  ];

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Top Banner Swiper - 使用优化组件，支持预加载和骨架屏 */}
      <OptimizedSwiper
        images={banners}
        className="h-48"
        autoplay
        loop
        title={t('home.title')}
      />

      {/* Search Box - Below Banner */}
      <div className="px-4 mt-4 relative z-10">
        <Card className="shadow-lg rounded-xl">
          <Form layout='horizontal' footer={
            <Button block color='primary' size='large' onClick={handleSearch}>
              {t('home.search_btn')}
            </Button>
          }>
            <Form.Item
              label={<MapPin className="text-blue-500" size={20} />}
            >
              <div className="flex gap-2">
                <Input 
                  placeholder={t('home.search_placeholder')}
                  value={city} 
                  onChange={val => setCity(val)} 
                  clearable
                  className="flex-1"
                  readOnly
                />
                <button
                  className={`text-blue-500 flex items-center gap-1 text-sm font-medium active:opacity-70 transition-opacity ${locating ? 'animate-pulse' : ''}`}
                  onClick={handleLocation}
                  disabled={locating}
                >
                  <Navigation size={16} className={locating ? 'animate-spin' : ''} />
                  {locating ? '定位中...' : '定位'}
                </button>
                <button
                  className="text-blue-500 flex items-center active:opacity-70 transition-opacity"
                  onClick={() => setShowCityPicker(true)}
                >
                  <ChevronDown size={20} />
                </button>
              </div>
            </Form.Item>
            
            <Form.Item
              label={<Calendar className="text-blue-500" size={20} />}
            >
              <div className="flex justify-between items-center w-full" onClick={() => setShowCalendar(true)}>
                <div className="flex-1">
                  <div className="text-xs text-gray-400">{t('home.check_in')}</div>
                  <div className="font-medium text-base">{format(dateRange.start, 'MM-dd')}</div>
                </div>
                <div className="px-4 text-gray-300">|</div>
                <div className="flex-1">
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

      <CalendarPicker
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        defaultDateRange={[dateRange.start, dateRange.end]}
        onConfirm={(start, end) => {
          setDateRange({ start, end });
        }}
      />

      <CityPicker
        visible={showCityPicker}
        onClose={() => setShowCityPicker(false)}
        onSelect={(selectedCity) => setCity(selectedCity)}
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
                className="relative w-32 h-40 rounded-lg overflow-hidden flex-shrink-0 snap-start shadow-sm active:opacity-80 transition-opacity cursor-pointer"
                onClick={() => {
                    setCity(cityItem.name);
                    Toast.show({ content: `已选择：${cityItem.name}`, duration: 1000 });
                }}
              >
                {/* 使用优化的图片组件 - 懒加载 + 骨架屏 */}
                <OptimizedImage
                  src={cityItem.image}
                  alt={cityItem.name}
                  fit="cover"
                  className="w-full h-full"
                  lazy
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                  <span className="text-white font-bold text-sm">{cityItem.name}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick City Tags */}
        <div className="mt-4 px-4">
          <div className="flex flex-wrap gap-2">
            {['北京', '上海', '广州', '深圳', '成都', '杭州', '武汉', '西安', '南京', '重庆', '三亚', '昆明'].map(cityName => (
              <button
                key={cityName}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  city === cityName
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
                }`}
                onClick={() => {
                  setCity(cityName);
                  Toast.show({ content: `已选择：${cityName}`, duration: 1000 });
                }}
              >
                {cityName}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Features */}
      <div className="mt-4 px-4 pb-4">
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

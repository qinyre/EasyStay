import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Search, Star, Navigation, ChevronDown, DollarSign, SlidersHorizontal } from 'lucide-react';
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
import { MOCK_HOTELS } from '../services/mockData';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { city, setCity, dateRange, setDateRange, keyword, setKeyword, starLevel, setStarLevel, priceRange, setPriceRange, toSearchParams } = useSearch();
  const [popularCities, setPopularCities] = useState<{ name: string; image: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);

  const featuredHotels = MOCK_HOTELS.slice(0, 4);

  // Calendar visibility
  const [showCalendar, setShowCalendar] = useState(false);

  // City picker visibility
  const [showCityPicker, setShowCityPicker] = useState(false);

  // Filter panel visibility
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  useEffect(() => {
    getPopularCities().then((data) => {
      setPopularCities(data);
      setLoading(false);
    });
  }, []);

  const handleSearch = () => {
    navigate(`/hotels?${toSearchParams().toString()}`);
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

  const starLevels = [
    { value: 0, label: '全部' },
    { value: 5, label: '五星' },
    { value: 4, label: '四星' },
    { value: 3, label: '三星' },
  ];

  const priceRanges = [
    { min: 0, max: 5000, label: '不限' },
    { min: 0, max: 300, label: '¥300以下' },
    { min: 300, max: 500, label: '¥300-500' },
    { min: 500, max: 800, label: '¥500-800' },
    { min: 800, max: 1200, label: '¥800-1200' },
    { min: 1200, max: 5000, label: '¥1200以上' },
  ];

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Top Hotel Banner Swiper */}
      <OptimizedSwiper
        hotels={featuredHotels.map(h => ({
          id: h.id,
          name_cn: h.name_cn,
          name_en: h.name_en,
          image: h.image || '',
          price_start: h.price_start,
          rating: h.rating
        }))}
        className="h-56"
        autoplay
        loop
      />

      {/* Search Box */}
      <div className="px-4 mt-4 relative z-10">
        <Card className="shadow-lg rounded-xl">
          <Form layout='horizontal' footer={
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className="flex-1 h-12 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border border-gray-200 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <SlidersHorizontal size={18} className="text-gray-600" />
                <span className="text-gray-700 font-medium">筛选</span>
                {(starLevel > 0 || priceRange.min > 0 || priceRange.max < 5000) && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </button>
              <Button block color='primary' size='large' className="flex-[2]" onClick={handleSearch}>
                {t('home.search_btn')}
              </Button>
            </div>
          }>
            <Form.Item label={<MapPin className="text-blue-500" size={20} />}>
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

            <Form.Item label={<Calendar className="text-blue-500" size={20} />}>
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

            <Form.Item label={<Search className="text-blue-500" size={20} />}>
              <Input
                placeholder="Keyword (Optional)"
                value={keyword}
                onChange={val => setKeyword(val)}
                clearable
              />
            </Form.Item>
          </Form>

          {/* Filter Panel */}
          {showFilterPanel && (
            <div className="border-t border-gray-100 pt-4 mt-4">
              {/* 星级筛选 */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="text-yellow-500" size={16} />
                  <span className="text-sm font-medium text-gray-700">星级</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {starLevels.map((level) => (
                    <button
                      key={level.value}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        starLevel === level.value
                          ? 'bg-yellow-500 text-white font-medium'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      onClick={() => setStarLevel(level.value)}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 价格筛选 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="text-green-500" size={16} />
                  <span className="text-sm font-medium text-gray-700">价格区间</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        priceRange.min === range.min && priceRange.max === range.max
                          ? 'bg-green-500 text-white font-medium'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      onClick={() => setPriceRange({ min: range.min, max: range.max })}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
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
            {['北京', '上海', '广州', '深圳', '成都', '杭州', '武汉', '西安', '南京', '重庆', '三亚', '新加坡'].map(cityName => (
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

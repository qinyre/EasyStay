import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, DollarSign, X } from 'lucide-react';
import { Dropdown, InfiniteScroll, NavBar, PullToRefresh, List, Button } from 'antd-mobile';
import { getHotels } from '../services/api';
import { Hotel } from '../types';
import { HotelCard } from '../components/HotelCard';
import { useTranslation } from 'react-i18next';

const HotelList: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Filter state from URL
  const city = searchParams.get('city') || '';
  const keyword = searchParams.get('keyword') || '';
  const starLevel = parseInt(searchParams.get('starLevel') || '0');
  const priceMin = parseInt(searchParams.get('priceMin') || '0');
  const priceMax = parseInt(searchParams.get('priceMax') || '5000');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');

  // Local filter state for dropdown
  const [localStarLevel, setLocalStarLevel] = useState(starLevel);

  // Update URL params helper
  const updateFilter = (key: string, value: string | number | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === null || value === '' || value === 0) {
      newParams.delete(key);
    } else {
      newParams.set(key, String(value));
    }
    setSearchParams(newParams);
  };

  const updatePriceRange = (min: number, max: number) => {
    const newParams = new URLSearchParams(searchParams);
    if (min === 0) {
      newParams.delete('priceMin');
    } else {
      newParams.set('priceMin', String(min));
    }
    if (max === 5000) {
      newParams.delete('priceMax');
    } else {
      newParams.set('priceMax', String(max));
    }
    setSearchParams(newParams);
  };

  const loadMore = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const nextPage = page + 1;
      const newHotels = await getHotels({
        city,
        keyword,
        starLevel,
        priceMin,
        priceMax,
        page: nextPage
      });

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
        const data = await getHotels({
          city,
          keyword,
          starLevel,
          priceMin,
          priceMax,
          page: 1
        });
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
  }, [city, keyword, starLevel, priceMin, priceMax]);

  // Sync local state with URL params
  useEffect(() => {
    setLocalStarLevel(starLevel);
  }, [starLevel]);

  // Sort functions
  const sortByRecommended = () => {
    const sorted = [...hotels].sort((a, b) => b.rating - a.rating);
    setHotels(sorted);
  };

  const sortByPriceLowHigh = () => {
    const sorted = [...hotels].sort((a, b) => (a.price_start || 0) - (b.price_start || 0));
    setHotels(sorted);
  };

  const sortByPriceHighLow = () => {
    const sorted = [...hotels].sort((a, b) => (b.price_start || 0) - (a.price_start || 0));
    setHotels(sorted);
  };

  const sortByRating = () => {
    const sorted = [...hotels].sort((a, b) => b.rating - a.rating);
    setHotels(sorted);
  };

  // Clear all filters
  const clearFilters = () => {
    const newParams = new URLSearchParams();
    if (city) newParams.set('city', city);
    if (checkIn) newParams.set('checkIn', checkIn);
    if (checkOut) newParams.set('checkOut', checkOut);
    setSearchParams(newParams);
  };

  const hasActiveFilters = starLevel > 0 || priceMin > 0 || priceMax < 5000;

  const priceRanges = [
    { min: 0, max: 5000, label: '不限' },
    { min: 0, max: 300, label: '¥300以下' },
    { min: 300, max: 500, label: '¥300-500' },
    { min: 500, max: 800, label: '¥500-800' },
    { min: 800, max: 1200, label: '¥800-1200' },
    { min: 1200, max: 5000, label: '¥1200以上' },
  ];

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
                    {checkIn && checkOut ? `${checkIn} - ${checkOut}` : t('hotelList.any_dates')}
                </div>
            </div>
        </NavBar>

        {/* Filter Bar */}
        <Dropdown>
          <Dropdown.Item key='sorter' title={t('hotelList.sort')}>
            <div style={{ padding: 12 }}>
              <List>
                <List.Item onClick={sortByRecommended}>{t('hotelList.recommended')}</List.Item>
                <List.Item onClick={sortByPriceLowHigh}>{t('hotelList.price_low_high')}</List.Item>
                <List.Item onClick={sortByPriceHighLow}>{t('hotelList.price_high_low')}</List.Item>
                <List.Item onClick={sortByRating}>{t('hotelList.rating')}</List.Item>
              </List>
            </div>
          </Dropdown.Item>
          <Dropdown.Item key='price' title='价格'>
            <div style={{ padding: 12, minWidth: 280 }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="text-green-500" size={18} />
                  <span className="font-medium text-gray-700">价格区间</span>
                </div>
                {priceMin > 0 || priceMax < 5000 ? (
                  <Button
                    size="mini"
                    fill="none"
                    onClick={() => {
                      updateFilter('priceMin', null);
                      updateFilter('priceMax', null);
                    }}
                  >
                    <X size={14} />
                  </Button>
                ) : null}
              </div>

              {/* 快捷价格选择 */}
              <div className="grid grid-cols-2 gap-2">
                {priceRanges.map((range) => (
                  <button
                    key={range.label}
                    className={`px-3 py-2 rounded-lg text-sm transition-all text-left ${
                      priceMin === range.min && priceMax === range.max
                        ? 'bg-green-500 text-white font-medium'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => updatePriceRange(range.min, range.max)}
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              {priceMin > 0 || priceMax < 5000 ? (
                <div className="mt-3 text-center text-sm text-gray-600 bg-gray-50 rounded-lg py-2">
                  当前选择: ¥{priceMin} - ¥{priceMax === 5000 ? '不限' : priceMax}
                </div>
              ) : null}
            </div>
          </Dropdown.Item>
          <Dropdown.Item key='star' title='星级'>
            <div style={{ padding: 12, minWidth: 200 }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-500" size={18} />
                  <span className="font-medium text-gray-700">星级</span>
                </div>
                {localStarLevel > 0 ? (
                  <Button
                    size="mini"
                    fill="none"
                    onClick={() => {
                      setLocalStarLevel(0);
                      updateFilter('starLevel', null);
                    }}
                  >
                    <X size={14} />
                  </Button>
                ) : null}
              </div>
              <List>
                <List.Item
                  onClick={() => {
                    setLocalStarLevel(0);
                    updateFilter('starLevel', null);
                  }}
                >
                  <div className={`flex items-center justify-between w-full ${localStarLevel === 0 ? 'text-blue-600 font-medium' : ''}`}>
                    <span>全部星级</span>
                    {localStarLevel === 0 && <span className="text-blue-500">✓</span>}
                  </div>
                </List.Item>
                {[5, 4, 3].map((level) => (
                  <List.Item
                    key={level}
                    onClick={() => {
                      setLocalStarLevel(level);
                      updateFilter('starLevel', level);
                    }}
                  >
                    <div className={`flex items-center justify-between w-full ${localStarLevel === level ? 'text-blue-600 font-medium' : ''}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500">{'★'.repeat(level)}</span>
                        <span>{level}星级</span>
                      </div>
                      {localStarLevel === level && <span className="text-blue-500">✓</span>}
                    </div>
                  </List.Item>
                ))}
              </List>
            </div>
          </Dropdown.Item>
        </Dropdown>

        {/* Active filters bar */}
        {hasActiveFilters && (
          <div className="px-4 py-2 bg-blue-50 border-t border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">已选:</span>
              {starLevel > 0 && (
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs flex items-center gap-1">
                  ★{starLevel}星
                  <X size={12} className="cursor-pointer" onClick={() => updateFilter('starLevel', null)} />
                </span>
              )}
              {(priceMin > 0 || priceMax < 5000) && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1">
                  ¥{priceMin}-{priceMax === 5000 ? '不限' : priceMax}
                  <X size={12} className="cursor-pointer" onClick={() => {
                    updateFilter('priceMin', null);
                    updateFilter('priceMax', null);
                  }} />
                </span>
              )}
            </div>
            <button
              className="text-xs text-blue-600 font-medium"
              onClick={clearFilters}
            >
              清除全部
            </button>
          </div>
        )}
      </div>

      {/* List */}
      <div className="flex-1">
        <PullToRefresh
          onRefresh={async () => {
            const data = await getHotels({ city, keyword, starLevel, priceMin, priceMax });
            setHotels(data);
            setHasMore(true);
          }}
        >
            <div className="p-4">
                {hotels.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-2">暂无符合条件的酒店</div>
                    {hasActiveFilters && (
                      <Button size="small" color="primary" onClick={clearFilters}>
                        清除筛选条件
                      </Button>
                    )}
                  </div>
                ) : (
                  <>
                    {hotels.map((hotel) => (
                        <HotelCard
                            key={hotel.id}
                            hotel={hotel}
                            onClick={() => navigate(`/hotel/${hotel.id}`)}
                        />
                    ))}
                    <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
                  </>
                )}
            </div>
        </PullToRefresh>
      </div>
    </div>
  );
};

export default HotelList;

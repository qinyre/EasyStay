import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, DollarSign, X, Tag, ArrowUp } from 'lucide-react';
import { Dropdown, InfiniteScroll, NavBar, PullToRefresh, List, Button, Skeleton } from 'antd-mobile';
import { getHotels } from '../services/api';
import { Hotel } from '../types';
import { HotelCard } from '../components/HotelCard';
import { useTranslation } from 'react-i18next';
import { useVirtualList } from 'ahooks';

const HotelList: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showBackTop, setShowBackTop] = useState(false);

  // Filter state from URL
  const city = searchParams.get('city') || '';
  const keyword = searchParams.get('keyword') || '';
  const starLevel = parseInt(searchParams.get('starLevel') || '0');
  const priceMin = parseInt(searchParams.get('priceMin') || '0');
  const priceMax = parseInt(searchParams.get('priceMax') || '5000');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const tagsParam = searchParams.get('tags');
  const selectedTags = tagsParam ? tagsParam.split(',') : [];

  // Local filter state for dropdown
  const [localStarLevel, setLocalStarLevel] = useState(starLevel);
  const [localTags, setLocalTags] = useState<string[]>(selectedTags);

  // 虚拟列表所需 Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [list] = useVirtualList(hotels, {
    containerTarget: containerRef,
    wrapperTarget: wrapperRef,
    itemHeight: 335, // 估算每个 HotelCard 的固定高度 (内容大体固定在 330px 左右)
    overscan: 5,
  });

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
        checkIn: checkIn || undefined,
        checkOut: checkOut || undefined,
        tags: selectedTags,
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
          checkIn: checkIn || undefined,
          checkOut: checkOut || undefined,
          tags: selectedTags,
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
  }, [city, keyword, starLevel, priceMin, priceMax, tagsParam]);

  // Sync local state with URL params
  useEffect(() => {
    setLocalStarLevel(starLevel);
  }, [starLevel]);

  // Handle scroll for Back to Top
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      setShowBackTop(container.scrollTop > 300);
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    setLocalTags([]);
    setLocalStarLevel(0);
  };

  const hasActiveFilters = starLevel > 0 || priceMin > 0 || priceMax < 5000 || selectedTags.length > 0;

  const priceRanges = [
    { min: 0, max: 5000, label: '不限' },
    { min: 0, max: 300, label: '¥300以下' },
    { min: 300, max: 500, label: '¥300-500' },
    { min: 500, max: 800, label: '¥500-800' },
    { min: 800, max: 1200, label: '¥800-1200' },
    { min: 1200, max: 5000, label: '¥1200以上' },
  ];

  return (
    <div className="bg-slate-50 h-screen flex flex-col overflow-hidden animate-page-in">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 shadow-sm">
        <NavBar
          onBack={() => navigate(-1)}
          backArrow={<ChevronLeft size={24} className="text-slate-700" />}
        >
          <div className="text-sm font-normal">
            <div className="font-bold text-slate-900">{city || t('hotelList.all_cities')}</div>
            <div className="text-xs text-slate-500">
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
                  <DollarSign className="text-emerald-500" size={18} />
                  <span className="font-medium text-slate-700">价格区间</span>
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
                    className={`px-3 py-2 rounded-xl text-sm transition-all text-left active:scale-[0.98] border border-transparent ${priceMin === range.min && priceMax === range.max
                      ? 'bg-emerald-500 text-white font-medium shadow-[0_2px_8px_rgba(16,185,129,0.2)]'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-100'
                      }`}
                    onClick={() => updatePriceRange(range.min, range.max)}
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              {priceMin > 0 || priceMax < 5000 ? (
                <div className="mt-3 text-center text-sm text-slate-600 bg-slate-50 rounded-xl py-2 font-medium">
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
                  <span className="font-medium text-slate-700">星级</span>
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
          <Dropdown.Item key='tags' title='标签'>
            <div style={{ padding: 12, minWidth: 280 }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Tag className="text-indigo-500" size={18} />
                  <span className="font-medium text-slate-700">特色标签</span>
                </div>
                {selectedTags.length > 0 ? (
                  <Button
                    size="mini"
                    fill="none"
                    onClick={() => {
                      setLocalTags([]);
                      updateFilter('tags', null);
                    }}
                  >
                    <X size={14} />
                  </Button>
                ) : null}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: '亲子', icon: '👨‍👩‍👧‍👦' },
                  { id: '免费停车场', icon: '🅿️' },
                  { id: '含早餐', icon: '🍳' },
                  { id: '无烟房', icon: '🚭' },
                  { id: '海景', icon: '🌊' },
                  { id: '江景', icon: '🏞️' },
                  { id: '近地铁', icon: '🚇' },
                  { id: '奢华', icon: '💎' },
                ].map((tag) => {
                  const isSelected = selectedTags.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      className={`px-3 py-2 rounded-xl text-sm transition-all flex items-center gap-2 text-left active:scale-[0.98] border border-transparent ${isSelected
                        ? 'bg-indigo-500 text-white font-medium shadow-sm'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-100'
                        }`}
                      onClick={() => {
                        const newTags = isSelected
                          ? selectedTags.filter(t => t !== tag.id)
                          : [...selectedTags, tag.id];
                        setLocalTags(newTags);
                        updateFilter('tags', newTags.length > 0 ? newTags.join(',') : null);
                      }}
                    >
                      <span>{tag.icon}</span>
                      <span>{tag.id}</span>
                      {isSelected && <span className="ml-auto">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </Dropdown.Item>
        </Dropdown>

        {/* Active filters bar */}
        {hasActiveFilters && (
          <div className="px-4 py-2 bg-blue-50/50 border-t border-blue-50 flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500 font-medium">已选:</span>
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
              {selectedTags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs flex items-center gap-1">
                  {tag}
                  <X size={12} className="cursor-pointer" onClick={() => {
                    const newTags = selectedTags.filter(t => t !== tag);
                    updateFilter('tags', newTags.length > 0 ? newTags.join(',') : null);
                  }} />
                </span>
              ))}
            </div>
            <button
              className="text-xs text-blue-600 font-medium active:scale-95 transition-transform"
              onClick={clearFilters}
            >
              清除全部
            </button>
          </div>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto" ref={containerRef}>
        <PullToRefresh
          onRefresh={async () => {
            const data = await getHotels({ city, keyword, starLevel, priceMin, priceMax, checkIn: checkIn || undefined, checkOut: checkOut || undefined, tags: selectedTags });
            setHotels(data);
            setHasMore(true);
          }}
        >
          <div className="flex flex-col gap-1">
            {hotels.length === 0 ? (
              loading ? (
                <div className="p-4 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-0 shadow-sm border border-slate-100 overflow-hidden">
                      <Skeleton.Title animated className="h-40 rounded-none m-0" />
                      <div className="p-4">
                        <Skeleton.Paragraph lineCount={2} animated />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 p-4">
                  <div className="text-slate-400 mb-2">暂无符合条件的酒店</div>
                  {hasActiveFilters && (
                    <Button size="small" color="primary" onClick={clearFilters} className="rounded-xl shadow-sm">
                      清除筛选条件
                    </Button>
                  )}
                </div>
              )
            ) : (
              <>
                <div ref={wrapperRef} className="px-4 pt-4">
                  {list.map((ele) => (
                    <HotelCard
                      key={ele.data.id}
                      hotel={ele.data}
                      onClick={() => navigate(`/hotel/${ele.data.id}`)}
                    />
                  ))}
                </div>
                <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
              </>
            )}
          </div>
        </PullToRefresh>
      </div>

      {showBackTop && (
        <div
          className="fixed bottom-6 right-6 w-12 h-12 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-slate-100 rounded-full flex items-center justify-center text-blue-600 transition-all active:scale-90 z-50 cursor-pointer"
          onClick={scrollToTop}
        >
          <ArrowUp size={24} />
        </div>
      )}
    </div>
  );
};

export default HotelList;

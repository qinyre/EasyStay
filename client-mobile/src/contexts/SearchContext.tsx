import React, { createContext, useContext, useState, ReactNode } from 'react';
import { addDays, differenceInDays } from 'date-fns';

interface PriceRange {
  min: number;
  max: number;
}

interface SearchContextType {
  city: string;
  setCity: (city: string) => void;
  dateRange: {
    start: Date;
    end: Date;
  };
  setDateRange: (range: { start: Date; end: Date }) => void;
  keyword: string;
  setKeyword: (keyword: string) => void;
  starLevel: number;
  setStarLevel: (level: number) => void;
  priceRange: PriceRange;
  setPriceRange: (range: PriceRange) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  toggleTag: (tag: string) => void;
  adjustNights: (delta: number) => void; // 调整间夜数
  resetFilters: () => void;
  toSearchParams: () => URLSearchParams;
}

const defaultPriceRange: PriceRange = { min: 0, max: 5000 };

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [city, setCity] = useState('上海');
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: addDays(new Date(), 1),
  });
  const [keyword, setKeyword] = useState('');
  const [starLevel, setStarLevel] = useState(0); // 0 = 全部
  const [priceRange, setPriceRange] = useState<PriceRange>(defaultPriceRange);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const resetFilters = () => {
    setStarLevel(0);
    setPriceRange(defaultPriceRange);
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // 快速调整间夜数 (1-30晚)
  const adjustNights = (delta: number) => {
    const currentNights = differenceInDays(dateRange.end, dateRange.start);
    const newNights = Math.max(1, Math.min(30, currentNights + delta));
    setDateRange({
      start: dateRange.start,
      end: addDays(dateRange.start, newNights)
    });
  };

  const toSearchParams = () => {
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    if (keyword) params.append('keyword', keyword);
    if (starLevel > 0) params.append('starLevel', starLevel.toString());
    if (priceRange.min > 0) params.append('priceMin', priceRange.min.toString());
    if (priceRange.max < 5000) params.append('priceMax', priceRange.max.toString());
    if (selectedTags.length > 0) params.append('tags', selectedTags.join(','));
    params.append('checkIn', dateRange.start.toISOString().split('T')[0]);
    params.append('checkOut', dateRange.end.toISOString().split('T')[0]);
    return params;
  };

  return (
    <SearchContext.Provider value={{
      city,
      setCity,
      dateRange,
      setDateRange,
      keyword,
      setKeyword,
      starLevel,
      setStarLevel,
      priceRange,
      setPriceRange,
      selectedTags,
      setSelectedTags,
      toggleTag,
      adjustNights,
      resetFilters,
      toSearchParams
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

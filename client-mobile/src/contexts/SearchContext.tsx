import React, { createContext, useContext, useState, ReactNode } from 'react';
import { addDays } from 'date-fns';

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

  const resetFilters = () => {
    setStarLevel(0);
    setPriceRange(defaultPriceRange);
  };

  const toSearchParams = () => {
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    if (keyword) params.append('keyword', keyword);
    if (starLevel > 0) params.append('starLevel', starLevel.toString());
    if (priceRange.min > 0) params.append('priceMin', priceRange.min.toString());
    if (priceRange.max < 5000) params.append('priceMax', priceRange.max.toString());
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

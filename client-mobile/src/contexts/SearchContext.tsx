import React, { createContext, useContext, useState, ReactNode } from 'react';
import { addDays } from 'date-fns';

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
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [city, setCity] = useState('上海');
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: addDays(new Date(), 1),
  });
  const [keyword, setKeyword] = useState('');

  return (
    <SearchContext.Provider value={{ city, setCity, dateRange, setDateRange, keyword, setKeyword }}>
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

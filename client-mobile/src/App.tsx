import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import Home from './pages/Home';
import HotelList from './pages/HotelList';
import HotelDetail from './pages/HotelDetail';

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-full p-10 text-center min-h-[50vh]">
    <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
    <p className="text-gray-500">This feature is coming soon.</p>
  </div>
);

import { SearchProvider } from './contexts/SearchContext';
import Bookings from './pages/Bookings';
import BookingDetail from './pages/BookingDetail';
import Me from './pages/Me';

function App() {
  return (
    <SearchProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="hotels" element={<HotelList />} />
            <Route path="hotel/:id" element={<HotelDetail />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="booking/:id" element={<BookingDetail />} />
            <Route path="profile" element={<Me />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SearchProvider>
  );
}

export default App;

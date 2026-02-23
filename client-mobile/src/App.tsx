import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import Home from './pages/Home';
import HotelList from './pages/HotelList';
import HotelDetail from './pages/HotelDetail';
import BookingConfirm from './pages/BookingConfirm';
import BookingSuccess from './pages/BookingSuccess';

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-full p-10 text-center min-h-[50vh]">
    <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
    <p className="text-gray-500">This feature is coming soon.</p>
  </div>
);

import { SearchProvider } from './contexts/SearchContext';
import { AuthProvider } from './contexts/AuthContext';
import Bookings from './pages/Bookings';
import BookingDetail from './pages/BookingDetail';
import Me from './pages/Me';
import TermsPage from './pages/legal/TermsPage';
import PrivacyPage from './pages/legal/PrivacyPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Settings from './pages/Settings';
import About from './pages/About';

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="hotels" element={<HotelList />} />
              <Route path="hotel/:id" element={<HotelDetail />} />
              <Route path="hotel/:hotelId/booking/:roomId" element={<BookingConfirm />} />
              <Route path="booking/success" element={<BookingSuccess />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="booking/:id" element={<BookingDetail />} />
              <Route path="profile" element={<Me />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
          </Routes>
        </BrowserRouter>
      </SearchProvider>
    </AuthProvider>
  );
}

export default App;

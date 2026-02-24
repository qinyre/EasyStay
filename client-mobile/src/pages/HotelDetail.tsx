import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Share2, Wifi, Coffee, Car, Star, Calendar } from 'lucide-react';
import { Grid, Image, Swiper, Toast, Skeleton } from 'antd-mobile';
import { getHotelById } from '../services/api';
import { Hotel } from '../types';
import { RoomCard } from '../components/RoomCard';
import { useSearch } from '../contexts/SearchContext';
import { CalendarPicker } from '../components/CalendarPicker';
import { format, differenceInDays } from 'date-fns';
import { useTranslation } from 'react-i18next';

const HotelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { dateRange, setDateRange } = useSearch();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [headerOpacity, setHeaderOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const opacity = Math.min(scrollY / 150, 1);
      setHeaderOpacity(opacity);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadHotel = async () => {
      if (id) {
        try {
          const data = await getHotelById(id);
          setHotel(data || null);
        } catch (error) {
          console.error('加载酒店详情失败:', error);
          Toast.show('加载酒店详情失败');
        } finally {
          setLoading(false);
        }
      }
    };

    loadHotel();
  }, [id]);

  if (loading) return (
    <div className="bg-white min-h-screen">
      <Skeleton.Title animated className="h-64 mb-4" />
      <div className="px-4">
        <Skeleton.Paragraph lineCount={3} animated />
        <Skeleton.Title animated className="mt-8 mb-4 h-10 rounded-xl" />
        <Skeleton.Paragraph lineCount={5} animated />
      </div>
    </div>
  );
  if (!hotel) return <div className="p-10 text-center text-slate-500">Hotel not found</div>;

  const sortedRooms = [...hotel.rooms].sort((a, b) => a.price - b.price);

  // Mock multiple images for swiper
  const images = hotel.images || [hotel.image, hotel.image, hotel.image];

  return (
    <div className="bg-white min-h-screen pb-20 relative animate-page-in">
      {/* Immersive Fixed Header */}
      <div
        className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-2 py-3 transition-colors duration-100"
        style={{
          backgroundColor: `rgba(255, 255, 255, ${headerOpacity})`,
          boxShadow: headerOpacity > 0.8 ? '0 2px 10px rgba(0,0,0,0.05)' : 'none',
        }}
      >
        <div
          className={`p-2 rounded-full active:scale-90 transition-all cursor-pointer ${headerOpacity > 0.5 ? 'bg-transparent text-slate-800' : 'bg-black/30 backdrop-blur-sm text-white'
            }`}
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={24} />
        </div>

        <div
          className="font-bold text-slate-900 absolute left-1/2 -translate-x-1/2 text-lg line-clamp-1 max-w-[50%] transition-opacity"
          style={{ opacity: headerOpacity }}
        >
          {hotel.name_cn}
        </div>

        <div
          className={`p-2 rounded-full active:scale-90 transition-all cursor-pointer ${headerOpacity > 0.5 ? 'bg-transparent text-slate-800' : 'bg-black/30 backdrop-blur-sm text-white'
            }`}
        >
          <Share2 size={22} />
        </div>
      </div>

      {/* Header Image Swiper */}
      <div className="relative h-64">
        <Swiper
          loop
          indicatorProps={{ className: 'custom-swiper-indicator' }}
          onIndexChange={(index) => setCurrentImageIndex(index)}
        >
          {images.map((img, index) => (
            <Swiper.Item key={index}>
              <Image src={img} fit='cover' className="w-full h-64" />
            </Swiper.Item>
          ))}
        </Swiper>

        <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full z-10">
          {currentImageIndex + 1}/{images.length} {t('hotelDetail.photos')}
        </div>
      </div>

      <div className="px-4 py-6 -mt-4 bg-white rounded-t-3xl relative z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] border-t border-slate-100">
        <div className="flex justify-between items-start">
          <h1 className="text-xl font-bold text-slate-900">{hotel.name_cn}</h1>
          <div className="flex flex-col items-end flex-shrink-0 ml-2">
            <div className="flex items-center text-blue-600 font-bold">
              <span className="text-lg">{hotel.rating}</span>
              <span className="text-xs ml-1">/ 5.0</span>
            </div>
            <span className="text-xs text-slate-400">123 {t('hotelDetail.reviews')}</span>
          </div>
        </div>
        <h2 className="text-sm text-slate-500 mt-1">{hotel.name_en}</h2>

        {/* Date Selection Bar */}
        <div
          className="flex items-center justify-between mt-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 active:scale-[0.98] transition-all cursor-pointer"
          onClick={() => setShowCalendar(true)}
        >
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-blue-600">
              <Calendar size={20} />
            </div>
            <div className="flex gap-4">
              <div>
                <div className="text-xs text-slate-400 mb-0.5">{t('home.check_in')}</div>
                <div className="font-bold text-slate-900">{format(dateRange.start, 'MM-dd')}</div>
              </div>
              <div className="self-center text-slate-200">|</div>
              <div>
                <div className="text-xs text-slate-400 mb-0.5">{t('home.check_out')}</div>
                <div className="font-bold text-slate-900">{format(dateRange.end, 'MM-dd')}</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-blue-600 font-bold text-sm">
            <span>{differenceInDays(dateRange.end, dateRange.start)} {t('booking.nights')}</span>
            <ChevronLeft size={16} className="rotate-180" />
          </div>
        </div>

        <CalendarPicker
          visible={showCalendar}
          onClose={() => setShowCalendar(false)}
          defaultDateRange={[dateRange.start, dateRange.end]}
          onConfirm={(start, end) => {
            setDateRange({ start, end });
            // No auto close
          }}
        />

        <div className="flex items-center mt-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <span className="font-bold mr-2 text-blue-600">{t('hotelDetail.location')}</span>
          <span className="line-clamp-1 text-slate-700">{hotel.location.address}</span>
        </div>

        {/* Facilities Grid */}
        <div className="mt-8">
          <h3 className="font-bold text-slate-900 mb-4 text-sm">{t('hotelDetail.facilities')}</h3>
          <Grid columns={5} gap={8}>
            {hotel.facilities?.map((fac, i) => (
              <Grid.Item key={i} className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-2xl h-20 border border-slate-100/50">
                {fac.toLowerCase().includes('wi-fi') && <Wifi size={20} className="text-slate-500 mb-1" />}
                {(fac.toLowerCase().includes('breakfast') || fac.toLowerCase().includes('restaurant')) && <Coffee size={20} className="text-slate-500 mb-1" />}
                {(fac.toLowerCase().includes('parking') || fac.toLowerCase().includes('car')) && <Car size={20} className="text-slate-500 mb-1" />}
                {!fac.toLowerCase().includes('wi-fi') && !fac.toLowerCase().includes('breakfast') && !fac.toLowerCase().includes('restaurant') && !fac.toLowerCase().includes('parking') && !fac.toLowerCase().includes('car') && <Star size={20} className="text-slate-500 mb-1" />}
                <span className="text-[10px] text-slate-500 text-center line-clamp-1 w-full leading-tight">{fac}</span>
              </Grid.Item>
            ))}
          </Grid>
        </div>

        {/* Description */}
        <div className="mt-8">
          <h3 className="font-bold text-slate-900 mb-3 text-sm">{t('hotelDetail.about')}</h3>
          <p className="text-sm text-slate-500 leading-relaxed text-justify">
            {hotel.description}
          </p>
        </div>

        {/* Rooms */}
        <div className="mt-10">
          <h3 className="font-bold text-slate-900 mb-4 text-lg">{t('hotelDetail.select_room')}</h3>
          {sortedRooms.map(room => (
            <RoomCard
              key={room.id}
              room={room}
              nights={differenceInDays(dateRange.end, dateRange.start)}
              onBook={() => navigate(`/hotel/${hotel.id}/booking/${room.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;

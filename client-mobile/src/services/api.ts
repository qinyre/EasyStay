import { Hotel, Booking } from '../types';
import { MOCK_HOTELS, MOCK_BOOKINGS } from './mockData';

export const getHotels = async (params?: { city?: string; keyword?: string; date?: Date; page?: number }): Promise<Hotel[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let result = [...MOCK_HOTELS];
  
  if (params?.city) {
    result = result.filter(h => h.location.city.includes(params.city!) || h.location.province.includes(params.city!));
  }
  
  if (params?.keyword) {
    const k = params.keyword.toLowerCase();
    result = result.filter(h => 
      h.name_cn.toLowerCase().includes(k) || 
      h.name_en.toLowerCase().includes(k) ||
      h.location.address.toLowerCase().includes(k)
    );
  }

  if (params?.page && params.page > 1) {
    const pageSize = 10;
    const start = (params.page - 1) * pageSize;
    return result.slice(start, start + pageSize);
  }

  return result.slice(0, 10);
};

export const getHotelById = async (id: string): Promise<Hotel | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_HOTELS.find(h => h.id === id);
};

export const getPopularCities = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { name: '上海', image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=40&fm=webp' },
    { name: '北京', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=40&fm=webp' },
    { name: '三亚', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=40&fm=webp' },
    { name: '杭州', image: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=40&fm=webp' },
  ];
};

export const getBookings = async (status?: string): Promise<Booking[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  if (status && status !== 'all') {
    return MOCK_BOOKINGS.filter(b => b.status === status);
  }
  return MOCK_BOOKINGS;
};

export const getBookingById = async (id: string): Promise<Booking | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_BOOKINGS.find(b => b.id === id);
};

import { Hotel } from '../types';
import { MOCK_HOTELS } from './mockData';

export const getHotels = async (params?: { city?: string; keyword?: string; date?: Date }): Promise<Hotel[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
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

  return result;
};

export const getHotelById = async (id: string): Promise<Hotel | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_HOTELS.find(h => h.id === id);
};

export const getPopularCities = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { name: 'Shanghai', image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { name: 'Beijing', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { name: 'Sanya', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { name: 'Hangzhou', image: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  ];
};

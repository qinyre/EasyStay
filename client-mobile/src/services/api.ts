import { Hotel, Booking } from '../types';
import { MOCK_HOTELS, MOCK_BOOKINGS } from './mockData';

const CITY_NAME_MAP: Record<string, string> = {
  '上海': 'Shanghai',
  '北京': 'Beijing',
  '广州': 'Guangzhou',
  '深圳': 'Shenzhen',
  '成都': 'Chengdu',
  '杭州': 'Hangzhou',
  '武汉': 'Wuhan',
  '西安': 'Xian',
  '南京': 'Nanjing',
  '重庆': 'Chongqing',
  '三亚': 'Sanya',
  '昆明': 'Kunming',
  '苏州': 'Suzhou',
  '厦门': 'Xiamen',
  '青岛': 'Qingdao',
  '天津': 'Tianjin',
  '哈尔滨': 'Harbin',
  '长沙': 'Changsha',
  '郑州': 'Zhengzhou',
  '济南': 'Jinan',
  '大连': 'Dalian',
  '丽江': 'Lijiang',
  '桂林': 'Guilin',
  '新加坡': 'Singapore',
  '香港': 'Hong Kong',
  '澳门': 'Macau',
  '台北': 'Taipei',
};

export interface GetHotelsParams {
  city?: string;
  keyword?: string;
  date?: Date;
  page?: number;
  starLevel?: number;
  priceMin?: number;
  priceMax?: number;
}

export const getHotels = async (params?: GetHotelsParams): Promise<Hotel[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  let result = [...MOCK_HOTELS];

  // 城市筛选
  if (params?.city) {
    const searchCity = params.city;
    const englishCity = CITY_NAME_MAP[searchCity] || searchCity;
    result = result.filter(h =>
      h.location.city.includes(searchCity) ||
      h.location.province.includes(searchCity) ||
      h.location.city.includes(englishCity) ||
      h.location.province.includes(englishCity) ||
      h.name_cn.includes(searchCity)
    );
  }

  // 关键词筛选
  if (params?.keyword) {
    const k = params.keyword.toLowerCase();
    result = result.filter(h =>
      h.name_cn.toLowerCase().includes(k) ||
      h.name_en.toLowerCase().includes(k) ||
      h.location.address.toLowerCase().includes(k)
    );
  }

  // 星级筛选
  if (params?.starLevel && params.starLevel > 0) {
    result = result.filter(h => h.star_level === params.starLevel);
  }

  // 价格区间筛选
  if (params?.priceMin !== undefined) {
    result = result.filter(h => (h.price_start || 0) >= params.priceMin!);
  }
  if (params?.priceMax !== undefined && params.priceMax < 5000) {
    result = result.filter(h => (h.price_start || 0) <= params.priceMax!);
  }

  // 分页
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

export interface CreateBookingParams {
  hotelId: string;
  roomId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  guestName: string;
  guestPhone: string;
}

export const createBooking = async (params: CreateBookingParams): Promise<Booking> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  // Get hotel info for display
  const hotel = MOCK_HOTELS.find(h => h.id === params.hotelId);
  const room = hotel?.rooms.find(r => r.id === params.roomId);

  // Generate booking ID
  const bookingId = `bk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const newBooking: Booking = {
    id: bookingId,
    hotelId: params.hotelId,
    roomId: params.roomId,
    userId: params.userId,
    checkIn: params.checkIn,
    checkOut: params.checkOut,
    totalPrice: params.totalPrice,
    status: params.status,
    guestName: params.guestName,
    guestPhone: params.guestPhone,
    createdAt: new Date().toISOString(),
    hotelName: hotel?.name_cn || '',
    hotelImage: hotel?.image || '',
    roomType: room?.type || '',
  };

  // Add to mock data (in real app, this would be persisted)
  MOCK_BOOKINGS.unshift(newBooking);

  return newBooking;
};

export const cancelBooking = async (bookingId: string): Promise<Booking> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const bookingIndex = MOCK_BOOKINGS.findIndex(b => b.id === bookingId);
  if (bookingIndex === -1) {
    throw new Error('Booking not found');
  }

  // Update status to cancelled
  MOCK_BOOKINGS[bookingIndex].status = 'cancelled';

  return MOCK_BOOKINGS[bookingIndex];
};

export const saveBooking = async (params: CreateBookingParams): Promise<Booking> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  // Get hotel info for display
  const hotel = MOCK_HOTELS.find(h => h.id === params.hotelId);
  const room = hotel?.rooms.find(r => r.id === params.roomId);

  // Generate booking ID
  const bookingId = `bk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const newBooking: Booking = {
    id: bookingId,
    hotelId: params.hotelId,
    roomId: params.roomId,
    userId: params.userId,
    checkIn: params.checkIn,
    checkOut: params.checkOut,
    totalPrice: params.totalPrice,
    status: 'pending',
    guestName: params.guestName,
    guestPhone: params.guestPhone,
    createdAt: new Date().toISOString(),
    hotelName: hotel?.name_cn || '',
    hotelImage: hotel?.image || '',
    roomType: room?.type || '',
  };

  // Add to mock data
  MOCK_BOOKINGS.unshift(newBooking);

  return newBooking;
};

export const updateBookingStatus = async (bookingId: string, status: 'confirmed' | 'cancelled' | 'completed'): Promise<Booking> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const bookingIndex = MOCK_BOOKINGS.findIndex(b => b.id === bookingId);
  if (bookingIndex === -1) {
    throw new Error('Booking not found');
  }

  // Update status
  MOCK_BOOKINGS[bookingIndex].status = status;

  return MOCK_BOOKINGS[bookingIndex];
};

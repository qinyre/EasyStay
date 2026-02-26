import axios from 'axios';
import { Hotel, Booking } from '../types';
import { MOCK_HOTELS, MOCK_BOOKINGS } from './mockData';
import { getImageUrl } from '../utils/url';

// Axios 实例配置
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 可以在这里添加 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    // 后端返回格式: { code: 200, data: ..., message: 'success' }
    // 自动提取 data 字段
    return response.data?.data || response.data;
  },
  (error) => {
    // 统一错误处理
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，跳转登录
          console.error('未授权，请重新登录');
          break;
        case 404:
          console.error('请求的资源不存在');
          break;
        case 500:
          console.error('服务器错误');
          break;
        default:
          console.error('请求错误:', error.response.data?.message || error.message);
      }
    } else if (error.request) {
      console.error('网络错误，请检查连接');
    } else {
      console.error('请求配置错误:', error.message);
    }
    return Promise.reject(error);
  }
);

// 是否使用真实 API (可通过环境变量控制)
// Use real API by default, fallback to mock only if explicitly set to 'false'
const USE_REAL_API = import.meta.env.VITE_USE_REAL_API !== 'false';

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
  checkIn?: string;
  checkOut?: string;
  page?: number;
  starLevel?: number;
  priceMin?: number;
  priceMax?: number;
  tags?: string[];
}

// 后端返回的酒店列表项结构
interface BackendHotelListItem {
  id: string;
  name_cn: string;
  name_en: string;
  address: string;
  location?: Location;
  star_level: number;
  image?: string;
  rating?: number;
  tags?: string[];
  price_start?: number;
  is_offline?: boolean;
  audit_status?: string;
  created_at?: string;
}

export const getHotels = async (params?: GetHotelsParams): Promise<Hotel[]> => {
  // 如果启用真实 API
  if (USE_REAL_API) {
    try {
      // 将前端的参数映射到后端的参数名
      const backendParams: Record<string, string | number | undefined> = {};
      if (params?.city) backendParams.city = params.city;
      if (params?.keyword) backendParams.keyword = params.keyword;
      if (params?.checkIn) backendParams.checkIn = params.checkIn;
      if (params?.checkOut) backendParams.checkOut = params.checkOut;
      if (params?.starLevel) backendParams.starLevel = params.starLevel;
      if (params?.priceMin) backendParams.priceMin = params.priceMin;
      if (params?.priceMax) backendParams.priceMax = params.priceMax;
      if (params?.tags && params.tags.length > 0) backendParams.tags = params.tags.join(',');
      if (params?.page) backendParams.page = params.page;

      const response = await apiClient.get('/mobile/hotels', { params: backendParams });
      // 响应拦截器已自动提取 data 字段，response 即为 { list, total, page, pageSize }
      const responseData = response as any;
      const list = responseData?.list || (Array.isArray(responseData) ? responseData : []);

      // 转换后端数据结构到前端期望的格式
      return list.map((h: BackendHotelListItem) => ({
        id: h.id,
        name_cn: h.name_cn,
        name_en: h.name_en,
        star_level: h.star_level,
        location: h.location || {
          province: '',
          city: '',
          address: h.address || ''
        },
        image: getImageUrl(h.image),
        rating: h.rating || 4.5,
        tags: h.tags || [],
        price_start: h.price_start,
        rooms: [],
        is_offline: h.is_offline || false,
        audit_status: (h.audit_status || 'approved') as 'pending' | 'approved' | 'rejected',
        created_at: h.created_at || new Date().toISOString()
      }));
    } catch (error) {
      console.error('获取酒店列表失败，回退到 Mock 数据:', error);
      // 回退到 Mock 数据
    }
  }

  // Mock 数据逻辑
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

  // 标签筛选
  if (params?.tags && params.tags.length > 0) {
    result = result.filter(h =>
      params.tags!.some(tag => h.tags?.includes(tag))
    );
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
  if (USE_REAL_API) {
    try {
      const response = await apiClient.get(`/mobile/hotels/${id}`);
      const hotel = response as unknown as Hotel;

      // format images
      if (hotel) {
        if (hotel.image) hotel.image = getImageUrl(hotel.image);
        if (hotel.images && Array.isArray(hotel.images)) {
          hotel.images = hotel.images.map(img => getImageUrl(img));
        }
        if (hotel.rooms && Array.isArray(hotel.rooms)) {
          hotel.rooms = hotel.rooms.map(room => ({
            ...room,
            image: getImageUrl(room.image)
          }));
        }
      }
      return hotel;
    } catch (error) {
      console.error('获取酒店详情失败，回退到 Mock 数据:', error);
    }
  }

  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_HOTELS.find(h => h.id === id);
};

export const getBanners = async () => {
  if (USE_REAL_API) {
    try {
      const response = await apiClient.get('/mobile/home/banners');
      return (response as any) || [];
    } catch (error) {
      console.error('获取首页Banner失败，回退到 Mock 数据:', error);
    }
  }

  await new Promise(resolve => setTimeout(resolve, 300));
  return [
    { id: 'banner_1', name: '上海陆家嘴禧酒店', image: 'https://images.unsplash.com/photo-1542314831-c53cd3816002?auto=format&fit=crop&q=80&w=1000', hotelId: 'hotel_123' },
    { id: 'banner_2', name: '北京王府井希尔顿酒店', image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&q=80&w=1000', hotelId: 'hotel_456' },
  ];
};

export const getPopularCities = async () => {
  if (USE_REAL_API) {
    try {
      const response = await apiClient.get('/mobile/home/popular-cities');
      return (response as any) || [];
    } catch (error) {
      console.error('获取热门城市失败，回退到 Mock 数据:', error);
    }
  }

  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { name: '上海', image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=40&fm=webp' },
    { name: '北京', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=40&fm=webp' },
    { name: '三亚', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=40&fm=webp' },
    { name: '杭州', image: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=40&fm=webp' },
  ];
};

export const getBookings = async (status?: string, page = 1, pageSize = 10): Promise<Booking[]> => {
  if (USE_REAL_API) {
    try {
      const params: any = { page, pageSize };
      if (status && status !== 'all') {
        params.status = status;
      }
      const response = await apiClient.get('/mobile/bookings', { params });
      const responseData = response as any;
      const list = responseData?.list || (Array.isArray(responseData) ? responseData : []);
      return list.map((b: any) => ({
        ...b,
        hotelImage: getImageUrl(b.hotelImage)
      }));
    } catch (error) {
      console.error('获取订单列表失败，回退到 Mock 数据:', error);
    }
  }

  await new Promise(resolve => setTimeout(resolve, 200));
  if (status && status !== 'all') {
    return MOCK_BOOKINGS.filter(b => b.status === status);
  }
  return MOCK_BOOKINGS;
};

export const getBookingById = async (id: string): Promise<Booking | undefined> => {
  if (USE_REAL_API) {
    try {
      const response = await apiClient.get(`/mobile/bookings/${id}`);
      const booking = response as unknown as Booking;
      if (booking && booking.hotelImage) {
        booking.hotelImage = getImageUrl(booking.hotelImage);
      }
      return booking;
    } catch (error) {
      console.error('获取订单详情失败，回退到 Mock 数据:', error);
    }
  }

  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_BOOKINGS.find(b => b.id === id);
};

export interface CreateBookingParams {
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  guestName: string;
  guestPhone: string;
}

export const createBooking = async (params: CreateBookingParams): Promise<Booking> => {
  if (USE_REAL_API) {
    try {
      const response = await apiClient.post('/mobile/bookings', params);
      return response as unknown as Booking;
    } catch (error) {
      console.error('创建订单失败，回退到 Mock 数据:', error);
    }
  }

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
    userId: '',
    checkIn: params.checkIn,
    checkOut: params.checkOut,
    totalPrice: params.totalPrice,
    status: 'pending',
    guestName: params.guestName,
    guestPhone: params.guestPhone,
    createdAt: new Date().toISOString(),
    hotelName: hotel?.name_cn || '',
    hotelNameEn: hotel?.name_en || '',
    hotelNameCn: hotel?.name_cn || '',
    hotelImage: hotel?.image || '',
    roomType: room?.type || '',
  };

  // Add to mock data (in real app, this would be persisted)
  MOCK_BOOKINGS.unshift(newBooking);

  return newBooking;
};

export const cancelBooking = async (bookingId: string): Promise<Booking> => {
  if (USE_REAL_API) {
    try {
      const response = await apiClient.patch(`/mobile/bookings/${bookingId}/cancel`, {});
      return response as unknown as Booking;
    } catch (error) {
      console.error('取消订单失败，回退到 Mock 数据:', error);
    }
  }

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
  if (USE_REAL_API) {
    try {
      const response = await apiClient.post('/mobile/bookings', { ...params, status: 'pending' });
      return response as unknown as Booking;
    } catch (error) {
      console.error('保存订单失败，回退到 Mock 数据:', error);
    }
  }

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
    userId: '',
    checkIn: params.checkIn,
    checkOut: params.checkOut,
    totalPrice: params.totalPrice,
    status: 'pending',
    guestName: params.guestName,
    guestPhone: params.guestPhone,
    createdAt: new Date().toISOString(),
    hotelName: hotel?.name_cn || '',
    hotelNameEn: hotel?.name_en || '',
    hotelNameCn: hotel?.name_cn || '',
    hotelImage: hotel?.image || '',
    roomType: room?.type || '',
  };

  // Add to mock data
  MOCK_BOOKINGS.unshift(newBooking);

  return newBooking;
};

export const updateBookingStatus = async (bookingId: string, status: 'confirmed' | 'cancelled' | 'completed'): Promise<Booking> => {
  if (USE_REAL_API) {
    try {
      const response = await apiClient.patch(`/mobile/bookings/${bookingId}`, { status });
      return response as unknown as Booking;
    } catch (error) {
      console.error('更新订单状态失败，回退到 Mock 数据:', error);
    }
  }

  await new Promise(resolve => setTimeout(resolve, 500));

  const bookingIndex = MOCK_BOOKINGS.findIndex(b => b.id === bookingId);
  if (bookingIndex === -1) {
    throw new Error('Booking not found');
  }

  // Update status
  MOCK_BOOKINGS[bookingIndex].status = status;

  return MOCK_BOOKINGS[bookingIndex];
};

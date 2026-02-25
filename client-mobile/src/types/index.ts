export interface Location {
  province: string;
  city: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface Room {
  id: string; // Added ID for key prop
  type: string;
  price: number;
  stock: number;
  description?: string;
  image?: string;
}

export interface Hotel {
  id: string;
  name_cn: string;
  name_en: string;
  star_level: number;
  location: Location;
  rooms: Room[];
  facilities?: string[];
  description?: string;
  rating: number;
  image?: string;
  images?: string[];
  is_offline: boolean;
  audit_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  price_start?: number; // Starting price for display
  tags?: string[]; // "Family", "Free Parking", etc.
}

export interface Booking {
  id: string;
  hotelId: string;
  roomId: string;
  userId: string;
  checkIn: string; // ISO date string
  checkOut: string; // ISO date string
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  guestName: string;
  guestPhone: string;
  createdAt: string;
  // Computed or populated fields for UI
  hotelName?: string; // Fallback or current default
  hotelNameEn?: string;
  hotelNameCn?: string;
  hotelImage?: string;
  roomType?: string;
  hotelAddress?: string;
  nights?: number;
}

// User Authentication Types
export interface User {
  id: string;
  phone: string;
  email?: string;
  name?: string;
  avatar?: string;
  role?: 'user' | 'merchant' | 'admin';
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface RegisterRequest {
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
  role?: 'user' | 'merchant';
}

export interface ForgotPasswordRequest {
  phone: string;
  email: string;
}

export interface SendVerificationCodeRequest {
  email: string;
}

export interface ResetPasswordWithCodeRequest {
  email: string;
  code: string;
  newPassword: string;
}

// 保留旧接口以兼容
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

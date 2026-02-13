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

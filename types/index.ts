export interface Hotel {
  id: number;
  name: string;
  address: string;
  city: string;
  nit: string;
  max_rooms: number;
  hotelRooms: HotelRoom[];
  created_at?: string;
  updated_at?: string;
}

export interface HotelRoom {
  id: number;
  hotel_id: number;
  room_type_id: number;
  accommodation_id: number;
  quantity: number;
  roomType: RoomType;
  accommodation: Accommodation;
  created_at?: string;
  updated_at?: string;
}

export interface RoomType {
  id: number;
  name: string;
  accommodations: Accommodation[];
  created_at?: string;
  updated_at?: string;
}

export interface Accommodation {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface HotelFormData {
  name: string;
  address: string;
  city: string;
  nit: string;
  max_rooms: number;
}

export interface HotelRoomFormData {
  room_type_id: number;
  accommodation_id: number;
  quantity: number;
}

export interface ValidationErrors {
  [key: string]: string[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  errors?: ValidationErrors;
}

export interface SubCategory {
  id: string;
  name: string;
  nameEn: string;
  nameTe: string;
  te: string;
  icon?: string;
  imageUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  nameTe: string;
  te?: string;
  icon?: string;
  imageUrl?: string;
  subcategories: SubCategory[];
}

export interface Listing {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  price: number;
  priceUnit: string;
  negotiable: boolean;
  quantity: string;
  quantityUnit: string;
  description: string;
  district: string;
  mandal: string;
  village: string;
  images: string[];
  video?: string;
  videoUrl?: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  sellerLocation?: string;
  createdAt: string;
  status?: 'active' | 'sold' | 'expired';
  featured?: boolean;
  views?: number;
  contactsCount?: number;
  customFields?: Record<string, string>;
}

export interface UserProfile {
  id: string;
  name?: string;
  displayName?: string;
  phone: string;
  email?: string;
  district: string;
  mandal: string;
  village: string;
  avatarUrl?: string;
  role?: 'seller' | 'buyer' | 'both';
  isAdmin?: boolean;
  createdAt?: string | number;
  updatedAt?: string | number;
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt: string | number;
}

export interface ChatThread {
  id: string;
  listingId?: string;
  listingTitle?: string;
  listingImage?: string;
  sellerId?: string;
  buyerId?: string;
  lastMessage?: string;
  lastMessageAt?: string | number;
  updatedAt?: string | number;
  participants?: string[];
  participantNames?: Record<string, string>;
  messages?: ChatMessage[];
}

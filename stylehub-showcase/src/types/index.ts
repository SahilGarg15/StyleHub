export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: 'men' | 'women' | 'children';
  subcategory: 'accessories' | 'attire' | 'footwear';
  sizes: string[];
  brand: string;
  rating: number;
  averageRating?: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  tags: string[];
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  reviews?: any[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface WishlistItem {
  product: Product;
  addedAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId?: string;
  guestEmail?: string;
  items: CartItem[];
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: 'cod';
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  trackingId?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery: string;
  statusHistory: { status: string; date: string; note?: string }[];
}

export interface SizeChart {
  category: string;
  subcategory: string;
  sizes: {
    size: string;
    chest?: string;
    waist?: string;
    hip?: string;
    length?: string;
    footLength?: string;
    shoulder?: string;
  }[];
}

export interface FilterOptions {
  category?: string;
  subcategory?: string;
  priceRange?: [number, number];
  sizes?: string[];
  brands?: string[];
  rating?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'popular';
  search?: string;
}

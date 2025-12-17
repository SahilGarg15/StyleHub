import api from '@/lib/api';
import { Product, Order, Review } from '@/types';

// Product Services
export const productService = {
  getAll: async (params?: {
    category?: string;
    subcategory?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sort?: string;
    sortBy?: string;
    order?: string;
    page?: number;
    limit?: number;
    isFeatured?: boolean;
    brands?: string;
    minRating?: number;
  }) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data.product;
  },

  getByCategory: async (category: string, limit?: number) => {
    const response = await api.get(`/products/category/${category}`, {
      params: { limit }
    });
    return response.data.products;
  },
};

// Order Services
export const orderService = {
  create: async (orderData: {
    items: Array<{ productId: string; quantity: number; size?: string }>;
    shippingAddress: any;
    paymentMethod?: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
  }) => {
    const response = await api.post('/orders', orderData);
    return response.data.order;
  },

  getUserOrders: async () => {
    const response = await api.get('/orders');
    return response.data.orders;
  },

  getById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data.order;
  },

  getByOrderNumber: async (orderNumber: string) => {
    const response = await api.get(`/orders/number/${orderNumber}`);
    return response.data.order;
  },

  updateStatus: async (orderId: string, status: string) => {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data.order;
  },

  track: async (id: string) => {
    const response = await api.get(`/orders/${id}/track`);
    return response.data.tracking;
  },
};

// Review Services
export const reviewService = {
  create: async (reviewData: {
    productId: string;
    rating: number;
    comment?: string;
  }) => {
    const response = await api.post('/reviews', reviewData);
    return response.data.review;
  },

  getByProduct: async (productId: string) => {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data;
  },

  update: async (id: string, data: { rating?: number; comment?: string }) => {
    const response = await api.put(`/reviews/${id}`, data);
    return response.data.review;
  },

  delete: async (id: string) => {
    await api.delete(`/reviews/${id}`);
  },
};

// Wishlist/Favorites Services
export const wishlistService = {
  getAll: async () => {
    const response = await api.get('/users/favorites');
    return response.data.favorites;
  },

  add: async (productId: string) => {
    const response = await api.post(`/users/favorites/${productId}`);
    return response.data.favorite;
  },

  remove: async (productId: string) => {
    await api.delete(`/users/favorites/${productId}`);
  },
};

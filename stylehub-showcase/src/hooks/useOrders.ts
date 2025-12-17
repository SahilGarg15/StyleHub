import { useState, useEffect, useCallback } from 'react';
import { Order, User } from '@/types';
import { orderService } from '@/lib/apiServices';
import { toast } from '@/hooks/use-toast';

export const useOrders = (user: User | null) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!user) {
      console.log('No user found, clearing orders');
      setOrders([]);
      return;
    }
    
    console.log('Fetching orders for user:', user.id);
    setIsLoading(true);
    try {
      const data = await orderService.getUserOrders();
      console.log('Orders fetched:', data);
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]); // Clear orders on error
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = useCallback(async (orderData: {
    items: Array<{ productId: string; quantity: number; size?: string }>;
    shippingAddress: any;
    paymentMethod?: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
  }) => {
    try {
      const order = await orderService.create(orderData);
      setOrders(prev => [order, ...prev]);
      
      toast({
        title: "Order Placed Successfully",
        description: `Your order #${order.orderNumber} has been placed.`,
      });
      
      return order;
    } catch (error: any) {
      toast({
        title: "Order Failed",
        description: error.response?.data?.message || "Failed to place order. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }, []);

  const getOrderById = useCallback(async (id: string) => {
    if (!id || id === 'undefined') {
      console.error('Invalid order ID:', id);
      return null;
    }
    try {
      return await orderService.getById(id);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      return null;
    }
  }, []);

  const getOrderByTrackingId = useCallback((trackingId: string) => {
    return orders.find(order => order.trackingId === trackingId) || null;
  }, [orders]);

  const updateOrderStatus = useCallback(async (orderId: string, status: string) => {
    try {
      await orderService.updateStatus(orderId, status);
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: status as any } : order
      ));
      toast({
        title: "Order Updated",
        description: `Order status updated to ${status}`,
      });
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  }, []);

  const trackOrder = useCallback(async (orderNumber: string) => {
    try {
      return await orderService.track(orderNumber);
    } catch (error) {
      console.error('Failed to track order:', error);
      return null;
    }
  }, []);

  return {
    orders,
    isLoading,
    createOrder,
    getOrderById,
    getOrderByTrackingId,
    updateOrderStatus,
    trackOrder,
    refreshOrders: fetchOrders,
  };
};

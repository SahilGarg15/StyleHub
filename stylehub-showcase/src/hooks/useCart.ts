import { useState, useEffect, useCallback } from 'react';
import { CartItem, Product } from '@/types';
import { toast } from '@/hooks/use-toast';

const CART_STORAGE_KEY = 'stylehub_cart';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse cart data');
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoading]);

  const addItem = useCallback((product: Product, quantity: number, selectedSize: string) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && 
                item.selectedSize === selectedSize
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prev, { product, quantity, selectedSize }];
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  }, []);

  const removeItem = useCallback((productId: string, selectedSize: string) => {
    setItems(prev => prev.filter(
      item => !(item.product.id === productId && 
                item.selectedSize === selectedSize)
    ));

    toast({
      title: "Removed from Cart",
      description: "Item has been removed from your cart.",
    });
  }, []);

  const updateQuantity = useCallback((productId: string, selectedSize: string, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(prev => prev.map(item => {
      if (item.product.id === productId && 
          item.selectedSize === selectedSize) {
        return { ...item, quantity };
      }
      return item;
    }));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
    });
  }, []);

  const getItemCount = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const getSubtotal = useCallback(() => {
    return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }, [items]);

  const getShipping = useCallback(() => {
    const subtotal = getSubtotal();
    return subtotal > 100 ? 0 : 9.99;
  }, [getSubtotal]);

  const getTax = useCallback(() => {
    return getSubtotal() * 0.08;
  }, [getSubtotal]);

  const getTotal = useCallback(() => {
    return getSubtotal() + getShipping() + getTax();
  }, [getSubtotal, getShipping, getTax]);

  return {
    items,
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemCount,
    getSubtotal,
    getShipping,
    getTax,
    getTotal,
  };
};

import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types';

const RECENTLY_VIEWED_KEY = 'stylehub_recently_viewed';
const MAX_ITEMS = 10;

export const useRecentlyViewed = () => {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse recently viewed data');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: Product) => {
    setItems(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, MAX_ITEMS);
    });
  }, []);

  const clearItems = useCallback(() => {
    setItems([]);
  }, []);

  return {
    items,
    addItem,
    clearItems,
  };
};

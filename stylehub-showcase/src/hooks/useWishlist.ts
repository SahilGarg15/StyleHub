import { useState, useEffect, useCallback } from 'react';
import { Product, User } from '@/types';
import { wishlistService } from '@/lib/apiServices';
import { toast } from '@/hooks/use-toast';

export const useWishlist = (user: User | null) => {
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await wishlistService.getAll();
      setItems(data.map((fav: any) => fav.product));
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addItem = useCallback(async (product: Product) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your wishlist.",
        variant: "destructive",
      });
      return;
    }

    try {
      await wishlistService.add(product.id);
      setItems(prev => [...prev, product]);
      
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    } catch (error) {
      toast({
        title: "Failed",
        description: "Failed to add to wishlist. Please try again.",
        variant: "destructive",
      });
    }
  }, [user]);

  const removeItem = useCallback(async (productId: string) => {
    try {
      await wishlistService.remove(productId);
      setItems(prev => prev.filter(p => p.id !== productId));
      
      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed from your wishlist.",
      });
    } catch (error) {
      toast({
        title: "Failed",
        description: "Failed to remove from wishlist. Please try again.",
        variant: "destructive",
      });
    }
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return items.some(p => p.id === productId);
  }, [items]);

  const toggleWishlist = useCallback((product: Product) => {
    if (isInWishlist(product.id)) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  }, [isInWishlist, addItem, removeItem]);

  const clearWishlist = useCallback(async () => {
    try {
      await Promise.all(items.map(item => wishlistService.remove(item.id)));
      setItems([]);
      
      toast({
        title: "Wishlist Cleared",
        description: "All items have been removed from your wishlist.",
      });
    } catch (error) {
      toast({
        title: "Failed",
        description: "Failed to clear wishlist. Please try again.",
        variant: "destructive",
      });
    }
  }, [items]);

  return {
    items,
    isLoading,
    addItem,
    removeItem,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
  };
};

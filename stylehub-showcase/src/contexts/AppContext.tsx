import React, { createContext, useContext, ReactNode } from 'react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

type CartContextType = ReturnType<typeof useCart>;
type WishlistContextType = ReturnType<typeof useWishlist>;
type AuthContextType = ReturnType<typeof useAuth>;
type OrdersContextType = ReturnType<typeof useOrders>;
type RecentlyViewedContextType = ReturnType<typeof useRecentlyViewed>;

const CartContext = createContext<CartContextType | null>(null);
const WishlistContext = createContext<WishlistContextType | null>(null);
const AuthContext = createContext<AuthContextType | null>(null);
const OrdersContext = createContext<OrdersContextType | null>(null);
const RecentlyViewedContext = createContext<RecentlyViewedContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const cart = useCart();
  const auth = useAuth();
  const wishlist = useWishlist(auth.user);
  const orders = useOrders(auth.user);
  const recentlyViewed = useRecentlyViewed();

  return (
    <AuthContext.Provider value={auth}>
      <CartContext.Provider value={cart}>
        <WishlistContext.Provider value={wishlist}>
          <OrdersContext.Provider value={orders}>
            <RecentlyViewedContext.Provider value={recentlyViewed}>
              {children}
            </RecentlyViewedContext.Provider>
          </OrdersContext.Provider>
        </WishlistContext.Provider>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCartContext must be used within AppProvider');
  return context;
};

export const useWishlistContext = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlistContext must be used within AppProvider');
  return context;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within AppProvider');
  return context;
};

export const useOrdersContext = () => {
  const context = useContext(OrdersContext);
  if (!context) throw new Error('useOrdersContext must be used within AppProvider');
  return context;
};

export const useRecentlyViewedContext = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) throw new Error('useRecentlyViewedContext must be used within AppProvider');
  return context;
};

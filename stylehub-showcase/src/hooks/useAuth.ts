import { useState, useEffect, useCallback } from 'react';
import { User, Address } from '@/types';
import { toast } from '@/hooks/use-toast';
import api from '@/lib/api';

const AUTH_STORAGE_KEY = 'stylehub_auth';
const TOKEN_STORAGE_KEY = 'authToken';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      
      console.log('Loading user - Token exists:', !!token, 'Stored user exists:', !!storedUser);
      
      if (token) {
        // First set user from localStorage for immediate UI update
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            console.log('User loaded from localStorage:', parsedUser.email);
          } catch (error) {
            console.error('Failed to parse stored user:', error);
          }
        }
        
        // Then verify with backend
        try {
          const response = await api.get('/auth/me');
          setUser(response.data.user);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response.data.user));
          console.log('User verified with backend:', response.data.user.email);
        } catch (error) {
          console.error('Failed to verify user with backend:', error);
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem(AUTH_STORAGE_KEY);
          setUser(null);
        }
      } else {
        console.log('No token found, user not authenticated');
      }
      setIsLoading(false);
    };
    
    loadUser();
  }, []);

  const register = useCallback(async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/register', { email, password, name });
      const { token, user: userData } = response.data;
      
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);

      toast({
        title: "Registration Successful",
        description: `Welcome to StyleHub, ${name}!`,
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || "An error occurred during registration.",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 Attempting login for:', email);
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      
      console.log('✅ Login successful, storing token and user data');
      console.log('Token:', token ? `${token.substring(0, 20)}...` : 'MISSING');
      console.log('User data:', userData);
      
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      
      console.log('💾 Stored in localStorage:', {
        token: localStorage.getItem(TOKEN_STORAGE_KEY) ? 'EXISTS' : 'MISSING',
        user: localStorage.getItem(AUTH_STORAGE_KEY) ? 'EXISTS' : 'MISSING'
      });
      
      setUser(userData);

      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.name}!`,
      });

      return true;
    } catch (error: any) {
      console.error('❌ Login failed:', error.response?.data || error.message);
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "Invalid email or password.",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    console.log('🚪 Logout called - clearing auth state');
    console.trace('Logout called from:'); // Shows call stack
    
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);

    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const response = await api.put('/users/profile', updates);
      const updatedUser = response.data.user;
      
      setUser(updatedUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  }, [user]);

  const addAddress = useCallback(async (address: Omit<Address, 'id'>) => {
    if (!user) return;

    try {
      await api.post('/users/addresses', address);
      
      // Refresh user data to get updated addresses
      const response = await api.get('/auth/me');
      setUser(response.data.user);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response.data.user));

      toast({
        title: "Address Added",
        description: "Your address has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed",
        description: "Failed to add address. Please try again.",
        variant: "destructive",
      });
    }
  }, [user]);

  const updateAddress = useCallback(async (addressId: string, address: Partial<Address>) => {
    if (!user) return;

    try {
      await api.put(`/users/addresses/${addressId}`, address);
      
      // Refresh user data
      const response = await api.get('/auth/me');
      setUser(response.data.user);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response.data.user));

      toast({
        title: "Address Updated",
        description: "Your address has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed",
        description: "Failed to update address. Please try again.",
        variant: "destructive",
      });
    }
  }, [user]);

  const removeAddress = useCallback(async (addressId: string) => {
    if (!user) return;

    try {
      await api.delete(`/users/addresses/${addressId}`);
      
      // Refresh user data
      const response = await api.get('/auth/me');
      setUser(response.data.user);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response.data.user));

      toast({
        title: "Address Removed",
        description: "Your address has been removed successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed",
        description: "Failed to remove address. Please try again.",
        variant: "destructive",
      });
    }
  }, [user]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    register,
    login,
    logout,
    updateProfile,
    addAddress,
    updateAddress,
    removeAddress,
  };
};

import { useEffect, useState } from 'react';

type User = {
  email: string;
  fullName: string;
  phoneNumber: string;
  userName: string;
  userType: string;
  id?: string;
  userId?: string; // Some APIs might use userId instead of id
};

export const useAuthUser = (): { user: User | null; userId: string | null; isLoading: boolean } => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserFromStorage = () => {
      try {
        if (typeof window === 'undefined') return null;
        
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        
        const userData = JSON.parse(userStr);
        setUser(userData);
        return userData;
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        return null;
      } finally {
        setIsLoading(false);
      }
    };

    getUserFromStorage();
  }, []);

  // The user ID might be in different fields depending on the API response
  const userId = user?.id || user?.userId || null;
  
  return {
    user,
    userId,
    isLoading,
  };
};

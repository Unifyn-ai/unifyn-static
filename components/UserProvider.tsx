'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { getUserDetails, logoutUser, UserDetails } from '../lib/user';

interface UserContextValue {
  user: UserDetails | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetch and update user details
   */
  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const userDetails = await getUserDetails();
      setUser(userDetails);
    } catch (error) {
      console.error('[UserProvider] Error refreshing user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout user and clear state
   */
  const logout = useCallback(async () => {
    try {
      const success = await logoutUser();
      if (success) {
        setUser(null);
      }
    } catch (error) {
      console.error('[UserProvider] Error logging out:', error);
    }
  }, []);

  // Fetch user details on mount
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const value: UserContextValue = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    refreshUser,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

/**
 * Custom hook to access user context
 * Throws an error if used outside of UserProvider
 */
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}


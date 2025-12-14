import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser } from '@/api/authService';

export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  is_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Add loading state
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Check localStorage for existing session
    const storedToken = localStorage.getItem('sweetshop_token');
    const storedUser = localStorage.getItem('sweetshop_user');
    
    if (storedToken && storedUser) {
      try {
        setAccessToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('sweetshop_token');
        localStorage.removeItem('sweetshop_user');
      }
    }
    
    // Set loading to false after checking localStorage
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await loginUser({ username, password });
      
      if (response.access_token && response.user) {
        setAccessToken(response.access_token);
        setUser(response.user);
        
        // Save to localStorage
        localStorage.setItem('sweetshop_token', response.access_token);
        localStorage.setItem('sweetshop_user', JSON.stringify(response.user));
        
        return { success: true };
      }
      
      return { success: false, error: 'Invalid login response' };
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle API errors
      if (error.detail) {
        return { success: false, error: error.detail };
      } else if (error.message) {
        return { success: false, error: error.message };
      }
      
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('sweetshop_token');
    localStorage.removeItem('sweetshop_user');
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
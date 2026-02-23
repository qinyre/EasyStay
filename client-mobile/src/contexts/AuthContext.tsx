import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser } from '../services/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (phone: string, email: string, password: string, name?: string, role?: 'user' | 'merchant') => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化：检查本地存储的登录状态
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        try {
          // 验证 token 是否有效
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        } catch {
          // Token 无效，清除本地存储
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (phone: string, password: string) => {
    const response = await apiLogin({ phone, password });

    // 保存到本地存储
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));

    setUser(response.user);
  };

  const register = async (phone: string, email: string, password: string, name?: string, role?: 'user' | 'merchant') => {
    const response = await apiRegister({
      phone,
      email,
      password,
      name,
      role,
      confirmPassword: password, // Mock API 需要这个字段
    });

    // 保存到本地存储
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));

    setUser(response.user);
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

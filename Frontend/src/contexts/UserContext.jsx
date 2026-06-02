// src/contexts/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { userApi } from '../api';
import { useAuth } from './AuthContext';

const UserContext = createContext(null);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};

export const UserProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const getUserInfo = async () => {
    if (!isAuthenticated) return null;
    setLoading(true);
    try {
      const response = await userApi.getInfo();
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Get user info failed:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data) => {
    try {
      await userApi.updateProfile(data);
      await getUserInfo(); // reload
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Cập nhật thất bại';
      return { success: false, message };
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      await userApi.changePassword(oldPassword, newPassword);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Đổi mật khẩu thất bại';
      return { success: false, message };
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      getUserInfo();
    } else {
      setUser(null);
    }
  }, [isAuthenticated]);

  const value = { user, getUserInfo, updateProfile, changePassword, loading };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
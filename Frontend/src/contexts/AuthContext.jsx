// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded);
      } catch {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password);
      const { token } = response.data;
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      setUserRole(decoded);
      return { success: true, user: decoded };
    } catch (error) {
      const message = error.response?.data?.message || 'Đăng nhập thất bại';
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      await authApi.register(userData);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Đăng ký thất bại';
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserRole(null);
    return { success: true };
  };

  const isAdmin = () => {
    if (!userRole) return false;
    const roles = userRole.role || userRole.roles;
    if (!roles) return false;
    if (Array.isArray(roles)) return roles.some(r => r.toLowerCase() === 'admin');
    return roles.toLowerCase() === 'admin';
  };

  const value = {
    isAuthenticated: !!userRole,
    userRole,
    login,
    register,
    logout,
    isAdmin,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
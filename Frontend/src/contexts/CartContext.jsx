// src/contexts/CartContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '../api';

const CartContext = createContext(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCart([]);
      setTotalItems(0);
      return;
    }
    setLoading(true);
    try {
      const res = await cartApi.getMyCart();
      // Giả sử API trả về { items: [...], totalQuantity }
      const items = res.data.items || [];
      setCart(items);
      setTotalItems(res.data.totalQuantity || items.reduce((sum, i) => sum + i.quantity, 0));
    } catch (err) {
      console.error('Fetch cart failed:', err);
      setCart([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = async (detailId, quantity = 1) => {
    try {
      await cartApi.addToCart(detailId, quantity);
      await fetchCart(); // reload lại giỏ
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Thêm vào giỏ thất bại';
      throw new Error(msg);
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    try {
      await cartApi.updateCartItem(cartItemId, quantity);
      await fetchCart();
    } catch (err) {
      const msg = err.response?.data?.message || 'Cập nhật thất bại';
      throw new Error(msg);
    }
  };

  const deleteCartItem = async (cartItemId) => {
    try {
      await cartApi.deleteCartItem(cartItemId);
      await fetchCart();
    } catch (err) {
      const msg = err.response?.data?.message || 'Xóa sản phẩm thất bại';
      throw new Error(msg);
    }
  };

  const clearCart = () => {
    setCart([]);
    setTotalItems(0);
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider value={{
      cart,
      totalItems,
      loading,
      fetchCart,
      addToCart,
      updateCartItem,
      deleteCartItem,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};
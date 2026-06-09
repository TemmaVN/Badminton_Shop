import React, { createContext, useContext, useState, useCallback } from "react";
import { productApi } from "../api";

const ProductContext = createContext(null);

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
  });

  // ─── helper dùng nội bộ ───────────────────────────────────────────────────
  const setPaginationFromResponse = ({ totalCount, totalPages, page }) => {
    setPagination({
      totalCount,
      totalPages,
      currentPage: page,
    });
  };
  const searchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productApi.search(params);
      const data = response.data; // { items, totalCount, totalPages, page }

      setProducts(data.items ?? []);
      setPaginationFromResponse(data);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message ?? err.message;
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductsBySlug = useCallback(async (categorySlug, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productApi.search(params);
      const data = response.data;
      setProducts(data.items ?? []);
      setPaginationFromResponse(data);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message ?? err.message;
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Xóa error thủ công (dùng ở UI nếu cần) ──────────────────────────────
  const clearError = useCallback(() => setError(null), []);
  // ─── Lấy chi tiết 1 sản phẩm theo slug ───────────────────────────────────

  const getProductDetaildBySlug = useCallback(async (slug) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productApi.getProductDetaildBySlug(slug);
      const product = response.data?.data ?? response.data;
      return product;
    } catch (err) {
      const msg = err.response?.data?.message ?? err.message;
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  // ─── Value ────────────────────────────────────────────────────────────────
  const value = {
    // state
    products,
    loading,
    error,
    pagination,

    // actions
    getProductDetaildBySlug,
    searchProducts,
    fetchProductsBySlug,
    clearError,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export default ProductContext;
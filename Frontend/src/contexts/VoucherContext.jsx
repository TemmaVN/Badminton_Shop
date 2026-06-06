import { createContext, useContext, useState, useCallback } from "react";
import { voucherApi } from "../api";

const VoucherContext = createContext(null);

export const VoucherProvider = ({ children }) => {
  const [allVouchers, setAllVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [savedIds, setSavedIds] = useState(new Set());
  const [error, setError] = useState(null);

  const fetchAllVouchers = useCallback(
    async (force = false) => {
      if (!force && fetched) return;
      setLoading(true);
      try {
        const res = await voucherApi.getAllAvailable();
        // backend: { message, data: [] }
        const data = res.data?.data ?? res.data;
        setAllVouchers(Array.isArray(data) ? data : []);
        setFetched(true);
      } catch {
        setAllVouchers([]);
      } finally {
        setLoading(false);
      }
    },
    [fetched],
  );

  const saveVoucher = useCallback(async (voucherId) => {
    try {
      setError(null);
      const res = await voucherApi.saveVoucher(voucherId);
      // success -> add to saved ids
      setSavedIds((prev) => new Set([...prev, voucherId]));
      return res.data ?? res;
    } catch (err) {
      setError(err.response?.data?.message || "Không thể lưu voucher");
      throw err;
    }
  }, []);

  // For checkout: POST /Voucher/my-voucher with cart items + payment method
  const getCheckoutVouchers = useCallback(
    async (orderDetails, paymentMethod) => {
      try {
        const res = await voucherApi.getAvailableVouchers({
          orderDetails,
          paymentMethod,
        });
        const data = res.data?.data ?? res.data;
        return Array.isArray(data) ? data : [];
      } catch {
        return [];
      }
    },
    [],
  );

  // Admin helpers
  const adminCreateVoucher = useCallback(async (data) => {
    try {
      setError(null);
      setLoading(true);
      const res = await voucherApi.adminCreate(data);
      return res.data?.data ?? res.data ?? res;
    } catch (err) {
      setError(err.response?.data?.message || "Tạo voucher thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const adminGetVouchers = useCallback(async (page = 1, pageSize = 10) => {
    try {
      setError(null);
      setLoading(true);
      const res = await voucherApi.adminGet(page, pageSize);
      return res.data?.data ?? res.data ?? [];
    } catch (err) {
      setError(
        err.response?.data?.message || "Không thể lấy danh sách voucher",
      );
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const adminSetVoucherActive = useCallback(async (voucherId, isActive) => {
    try {
      setError(null);
      setLoading(true);
      const res = await voucherApi.adminSetVoucherActive(voucherId, isActive);
      // update local cache if present
      setAllVouchers((prev) =>
        prev.map((v) =>
          v.id === voucherId || v._id === voucherId ? { ...v, isActive } : v,
        ),
      );
      return res.data?.data ?? res.data ?? res;
    } catch (err) {
      setError(
        err.response?.data?.message || "Cập nhật trạng thái voucher thất bại",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <VoucherContext.Provider
      value={{
        allVouchers,
        loading,
        fetched,
        savedIds,
        error,
        fetchAllVouchers,
        saveVoucher,
        getCheckoutVouchers,
        adminCreateVoucher,
        adminGetVouchers,
        adminSetVoucherActive,
      }}
    >
      {children}
    </VoucherContext.Provider>
  );
};

export const useVoucher = () => {
  const ctx = useContext(VoucherContext);
  if (!ctx) throw new Error("useVoucher must be used inside VoucherProvider");
  return ctx;
};

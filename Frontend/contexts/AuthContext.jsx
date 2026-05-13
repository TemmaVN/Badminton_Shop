import { createContext, useContext, useState } from "react";
import { authApi } from "../api";
import jwtDecode from "jwt-decode";
const AuthContext = createContext(null);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(() => {
    const raw = localStorage.getItem("userRole");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  });
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authApi.login(email, password);
      const token = response.data?.data;
      if (token) {
        const decodedUser = jwtDecode(token);
        localStorage.setItem("token", token);
        localStorage.setItem("userRole", JSON.stringify(decodedUser));
        setUserRole(decodedUser);
      }
      return { success: false, message: "Login failed" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "login failed",
      };
    } finally {
      setLoading(false);
    }
  };
  const logout = () => {
    setLoading(true);
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      setUserRole(null);
      return { success: true, message: "Logout successful" };
    } catch (error) {
      return { success: false, message: "Logout failed" };
    } finally {
      setLoading(false);
    }
  };
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authApi.register({
        email: userData.email,
        password: userData.password,
      });
      return {
        success: true,
        message: response.data?.message || "Registration successful",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };
  const value = {
    login,
    logout,
    register,
    loading,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

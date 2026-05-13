import { createContext, useContext, useState, useEffect } from "react";
import { userApi } from "../api";

const UserContext = createContext(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const changePassword = async (oldPassword, newPassword) => {
    try {
      const response = await userApi.changePassword({
        oldPassword,
        newPassword,
      });
      return {
        success: true,
        message: response.data?.message || "Password changed successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to change password",
      };
    }
  };
  const updateProfile = async (
    fullName,
    dateOfBirth,
    phoneNumber,
    city,
    district,
    detailedAddress,
  ) => {
    try {
      const response = await userApi.UpdateProfile({
        fullName,
        dateOfBirth,
        phoneNumber,
        city,
        district,
        detailedAddress,
      });
      return {
        success: true,
        message: response.data?.message || "Profile updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update profile",
      };
    }
  };
  const getUserInfo = async () => {
    setLoading(true);
    try {
      const response = await userApi.get_info();
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error("Failed to get user info:", error);
    } finally {
      setLoading(false);
    }
  };
  const value = {
    user,
    changePassword,
    updateProfile,
    getUserInfo,
    loading,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

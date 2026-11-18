import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [merchant, setMerchant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        const response = await authService.getProfile();
        if (response && response.success && response.data) {
          setIsAuthenticated(true);
          setUser(response.data.user);
          setMerchant(response.data.merchant);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();

    const handleSessionExpired = () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setIsAuthenticated(false);
      setUser(null);
      setMerchant(null);
    };

    window.addEventListener("session_expired", handleSessionExpired);
    return () => window.removeEventListener("session_expired", handleSessionExpired);
  }, []);

  const login = (userData, merchantData, token, refreshToken) => {
    if (userData) setUser(userData);
    if (merchantData) setMerchant(merchantData);
    if (token) localStorage.setItem("accessToken", token);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error("Logout API failed", e);
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    setUser(null);
    setMerchant(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        merchant,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

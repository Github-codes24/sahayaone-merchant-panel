import { API_BASE_URL } from "./apiConfig";

const extractError = async (response) => {
  try {
    const errData = await response.json();
    return new Error(errData?.message || errData?.error || errData?.data?.message || "Request failed");
  } catch {
    return new Error(`HTTP error! status: ${response.status}`);
  }
};

export const authService = {
  login: async (payload) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/merchant/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include"
    });
    if (!response.ok) throw await extractError(response);
    return response.json();
  },
  
  forgotPassword: async (payload) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/merchant/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include"
    });
    if (!response.ok) throw await extractError(response);
    return response.json();
  },
    
  verifyOtp: async (payload) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/merchant/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include"
    });
    if (!response.ok) throw await extractError(response);
    return response.json();
  },
    
  resetPassword: async (payload) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/merchant/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include"
    });
    if (!response.ok) throw await extractError(response);
    return response.json();
  },
    
  logout: async () => {
    const token = localStorage.getItem("accessToken");
    const headers = {};
    if (token && token !== "undefined" && token !== "null") {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/api/v1/merchant/auth/logout`, {
      method: "POST",
      headers,
      credentials: "include"
    });
    if (!response.ok) throw await extractError(response);
    return response.json();
  },
  
  resendOtp: async (payload) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/merchant/auth/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include"
    });
    if (!response.ok) throw await extractError(response);
    return response.json();
  },

  getProfile: async () => {
    const token = localStorage.getItem("accessToken");
    const headers = {};
    if (token && token !== "undefined" && token !== "null") {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/api/v1/merchant/auth/me`, {
      method: "GET",
      headers,
      credentials: "include"
    });
    if (!response.ok) throw await extractError(response);
    return response.json();
  },

  changePassword: async (payload) => {
    const token = localStorage.getItem("accessToken");
    const headers = { "Content-Type": "application/json" };
    if (token && token !== "undefined" && token !== "null") {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/api/v1/merchant/auth/change-password`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      credentials: "include"
    });
    if (!response.ok) throw await extractError(response);
    return response.json();
  },

  refreshSession: async (payload) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/merchant/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload ? JSON.stringify(payload) : undefined,
      credentials: "include"
    });
    if (!response.ok) throw await extractError(response);
    return response.json();
  }
};

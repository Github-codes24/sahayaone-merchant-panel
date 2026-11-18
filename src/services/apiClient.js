import { authService } from "./authService";
import { API_BASE_URL } from "./apiConfig";

const BASE_URL = API_BASE_URL;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

export const apiClient = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
  
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const token = localStorage.getItem("accessToken");
  if (
    token && 
    token !== "undefined" && 
    token !== "null" && 
    !endpoint.includes("/auth/login") && 
    !endpoint.includes("/auth/refresh") && 
    !headers.has("Authorization")
  ) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const config = {
    ...options,
    headers,
    credentials: "include", // Ensure cookies are sent and received
    signal: controller.signal,
  };

  try {
    let response = await fetch(url, config);
    clearTimeout(timeoutId);

    // Handle 401 Unauthorized by attempting to refresh the token
    if (response.status === 401 && !endpoint.includes("/auth/refresh") && !endpoint.includes("/auth/login")) {
      if (isRefreshing) {
        // If already refreshing, wait for it to complete
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          const freshToken = localStorage.getItem("accessToken");
          if (freshToken) {
            config.headers.set("Authorization", `Bearer ${freshToken}`);
          }
          return fetch(url, config).then(async (retryResp) => {
            if (!retryResp.ok) {
              // Only throw if it's truly broken to allow json extraction below
              if (retryResp.status === 401) throw new Error("Retry failed");
            }
            // For 204
            if (retryResp.status === 204) return null;
            return retryResp.json();
          });
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token available");

        const refreshResponse = await authService.refreshSession({ refreshToken });
        const newToken = refreshResponse?.data?.accessToken || refreshResponse?.accessToken;
        const newRefreshToken = refreshResponse?.data?.refreshToken || refreshResponse?.refreshToken;
        
        if (newToken) {
          localStorage.setItem("accessToken", newToken);
          config.headers.set("Authorization", `Bearer ${newToken}`);
        }
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }
        
        isRefreshing = false;
        processQueue(null);
        // Retry the original request
        response = await fetch(url, config);
      } catch (err) {
        isRefreshing = false;
        processQueue(err);
        // Dispatch event so AuthContext can log out the user
        window.dispatchEvent(new Event("session_expired"));
        return Promise.reject(err);
      }
    }

    if (response.status === 204) return null;

    let data;
    try {
      data = await response.json();
    } catch (err) {
      data = null;
    }

    if (!response.ok) {
      const error = new Error(data?.message || data?.error || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      const timeoutError = new Error("Request timed out");
      timeoutError.status = 408;
      throw timeoutError;
    }
    throw error;
  }
};

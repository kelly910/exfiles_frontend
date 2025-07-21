import axios from 'axios';
import urlMapper from './apiEndPoints/urlMapper';

// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getStoredToken = (): string | null => {
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem('loggedInUser');
    return storedUser;
  }
  return null;
};

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const getLoggedInUser = getStoredToken();
    const parsedUser = getLoggedInUser ? JSON.parse(getLoggedInUser) : null;
    const token: string | null = parsedUser?.data?.token || null;

    if (token) {
      config.headers.Authorization = `Token ${token}`; // Attach token to headers
    }

    // Remove Authorization Token In Login API
    if (
      config.url?.includes(urlMapper.login) ||
      (config.url?.includes(urlMapper.register) && config?.method === 'post') ||
      config.url?.includes(urlMapper.googleLogin) ||
      config.url?.includes(urlMapper.forgotPassword) ||
      config.url?.includes(urlMapper.resetPassword) ||
      config.url?.includes(urlMapper.verifyOtp)
    ) {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response, // Return response if successful
  async (error) => {
    // const originalRequest = error.config;

    // Handle 401 (Unauthorized) Error
    // if (error.response?.status === 401 && !originalRequest._retry) {
    if (error.response?.status === 401) {
      // originalRequest._retry = true;
      localStorage.removeItem('loggedInUser');
      document.cookie = `accessToken=; path=/; max-age=0`;
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;

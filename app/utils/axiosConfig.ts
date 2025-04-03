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

    if (config.url?.includes(urlMapper.login)) {
      delete config.headers.Authorization;
    }

    if (token) {
      config.headers.Authorization = `Token ${token}`; // Attach token to headers
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response, // Return response if successful
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 (Unauthorized) Errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt token refresh (if applicable)
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/refresh`,
            { token: refreshToken }
          );

          const newToken = response.data.token;
          localStorage.setItem('token', newToken);
          originalRequest.headers.Authorization = `Token ${newToken}`;

          return api(originalRequest); // Retry original request with new token
        }
      } catch (refreshError) {
        console.error('Token refresh failed', refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        document.cookie = `accessToken=; path=/; max-age=0`;
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;

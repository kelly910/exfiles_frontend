import axios from 'axios';

// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get token from storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to headers
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
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return api(originalRequest); // Retry original request with new token
        }
      } catch (refreshError) {
        console.error('Token refresh failed', refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;

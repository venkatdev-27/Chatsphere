import axios from 'axios';
import { getToken } from '../utils/authHelper';

const axiosInstance = axios.create({
 baseURL: import.meta.env.VITE_API_URL, // MUST be /api
  withCredentials: true
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized access. Please login again.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

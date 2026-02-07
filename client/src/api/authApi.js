import axiosInstance from './axiosInstance';

export const login = (data) => axiosInstance.post('/auth/login', data);
export const register = (data) => axiosInstance.post('/auth/signup', data);
export const getMeAPI = () => axiosInstance.get('/auth/me');
export const updateProfilePicAPI = (formData) => axiosInstance.post('/auth/profile-pic', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

export const searchUsersAPI = (search) => axiosInstance.get(`/auth?search=${search}`);


import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

/**
 * Helper to extract backend error safely
 */
const getErrorPayload = (error) => {
  if (error.response && error.response.data) {
    return {
      error: error.response.data.error || 'ERROR',
      message: error.response.data.message || 'Something went wrong',
    };
  }

  return {
    error: 'NETWORK_ERROR',
    message: error.message || 'Network error',
  };
};

// ---------------- LOGIN ----------------
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/login', userData);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

// ---------------- SIGNUP ----------------
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/signup', userData);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

// ---------------- CHECK AUTH ----------------
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue({
          error: 'NO_TOKEN',
          message: 'No token found',
        });
      }

      const response = await axiosInstance.get('/auth/me');
      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

// ---------------- UPDATE PROFILE ----------------
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/profile-pic', formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

// ---------------- SEARCH USERS ----------------
export const searchUsers = createAsyncThunk(
  'auth/searchUsers',
  async (search, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/auth?search=${search}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

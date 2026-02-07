import { createSlice } from '@reduxjs/toolkit';
import {
  loginUser,
  signupUser,
  checkAuth,
  updateProfile,
  searchUsers,
} from '../thunks/authThunks';

/**
 * Normalize all errors into a predictable shape
 * This is the KEY fix for your UI issue
 */
const normalizeError = (payload) => {
  if (!payload) {
    return {
      code: 'UNKNOWN_ERROR',
      message: 'Something went wrong',
    };
  }

  if (typeof payload === 'string') {
    return {
      code: 'ERROR',
      message: payload,
    };
  }

  return {
    code: payload.error || payload.code || 'ERROR',
    message: payload.message ||  payload.error ||'Something went wrong',
  };
};

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null, // { code, message }
  isAuthenticated: false,
  searchResults: [],
  isSearchLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.searchResults = [];
      state.isSearchLoading = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },

  extraReducers: (builder) => {
    builder
      // ---------------- LOGIN ----------------
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = normalizeError(action.payload);
      })

      // ---------------- SIGNUP ----------------
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = normalizeError(action.payload);
      })

      // ---------------- CHECK AUTH ----------------
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })

      // ---------------- UPDATE PROFILE ----------------
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      // ---------------- SEARCH USERS ----------------
      .addCase(searchUsers.pending, (state) => {
        state.isSearchLoading = true;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.isSearchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.isSearchLoading = false;
        state.error = normalizeError(action.payload);
      });
  },
});

export const { logout, clearError, clearSearchResults } = authSlice.actions;
export default authSlice.reducer;

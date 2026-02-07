import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const fetchChats = createAsyncThunk(
  'chat/fetchChats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get('/chat');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const accessChat = createAsyncThunk(
  'chat/accessChat',
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/chat', { userId });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const markChatAsRead = createAsyncThunk(
  'chat/markChatAsRead',
  async (chatId, { rejectWithValue }) => {
    try {
      await axiosInstance.put(`/message/read/${chatId}`);
      return chatId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createGroupChat = createAsyncThunk('chat/createGroupChat', async (groupData, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.post('/chat/group', groupData);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const renameGroup = createAsyncThunk('chat/renameGroup', async ({ chatId, chatName }, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.put('/chat/rename', { chatId, chatName });
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const addToGroup = createAsyncThunk('chat/addToGroup', async ({ chatId, userId }, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.put('/chat/groupadd', { chatId, userId });
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const removeFromGroup = createAsyncThunk('chat/removeFromGroup', async ({ chatId, userId }, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.put('/chat/groupremove', { chatId, userId });
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const deleteChat = createAsyncThunk('chat/deleteChat', async (chatId, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.delete(`/chat/${chatId}`);
        return { ...data, chatId };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

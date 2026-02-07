import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMessagesAPI, sendMessageAPI, deleteMessageForMeAPI, deleteMessageForEveryoneAPI, clearChatAPI } from '../../api/messageApi';

export const fetchMessages = createAsyncThunk(
  'message/fetchMessages',
  async ({ chatId, limit, before }, { rejectWithValue }) => {
    try {
      const data = await fetchMessagesAPI(chatId, limit, before);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'message/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      const data = await sendMessageAPI(messageData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteMessageForMe = createAsyncThunk(
  'message/deleteMessageForMe',
  async (messageId, { rejectWithValue }) => {
    try {
      await deleteMessageForMeAPI(messageId);
      return messageId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteMessageForEveryone = createAsyncThunk(
  'message/deleteMessageForEveryone',
  async (messageId, { rejectWithValue }) => {
    try {
      const data = await deleteMessageForEveryoneAPI(messageId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const clearChat = createAsyncThunk(
  'message/clearChat',
  async (chatId, { rejectWithValue }) => {
    try {
      await clearChatAPI(chatId);
      return chatId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

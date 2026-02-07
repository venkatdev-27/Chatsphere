import { createSlice } from '@reduxjs/toolkit';
import { fetchMessages, sendMessage, deleteMessageForMe, deleteMessageForEveryone, clearChat } from '../thunks/messageThunks';

const initialState = {
  messages: [],
  loading: false,
  sending: false,
  error: null,
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      if (!state.messages.some(m => m._id === action.payload._id)) {
        state.messages = [...state.messages, action.payload];
      }
    },
    updateMessage: (state, action) => {
        const { _id, content } = action.payload;
        const index = state.messages.findIndex(m => m._id === _id);
        if (index !== -1) {
            state.messages[index].content = content;
        }
    },
    clearMessageError: (state) => {
      state.error = null;
    },
    handleMessageDeleted: (state, action) => {
      const { messageId, isDeletedForEveryone } = action.payload;
      
      if (isDeletedForEveryone) {
        const messageIndex = state.messages.findIndex(m => m._id === messageId);
        if (messageIndex !== -1) {
          state.messages[messageIndex].isDeletedForEveryone = true;
          state.messages[messageIndex].content = '';
          state.messages[messageIndex].file = '';
          state.messages[messageIndex].fileType = '';
        }
      } else {
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg.before) {
            state.messages = [...action.payload, ...state.messages];
        } else {
            state.messages = action.payload;
        }
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.sending = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false;
        state.messages = [...state.messages, action.payload];
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload;
      })
      .addCase(deleteMessageForMe.fulfilled, (state, action) => {
        state.messages = state.messages.filter(m => m._id !== action.payload);
      })
      .addCase(deleteMessageForEveryone.fulfilled, (state, action) => {
        const { messageId, message } = action.payload;
        const messageIndex = state.messages.findIndex(m => m._id === messageId);
        if (messageIndex !== -1 && message) {
          state.messages[messageIndex] = message;
        }
      })
      .addCase(clearChat.fulfilled, (state) => {
        state.messages = [];
      });
  },
});

export const { addMessage, clearMessageError, handleMessageDeleted, updateMessage } = messageSlice.actions;
export default messageSlice.reducer;

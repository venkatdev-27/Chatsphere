import { createSlice } from '@reduxjs/toolkit';
import { fetchChats, accessChat, createGroupChat, renameGroup, addToGroup, removeFromGroup, deleteChat } from '../thunks/chatThunks';

const initialState = {
  chats: [],
  selectedChat: null,
  loading: false,
  error: null,
  notification: [], // To store unread message notifications
  onlineUsers: [], // Store online users list 🟢
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    addUserOnline: (state, action) => {
      if (!state.onlineUsers.some((u) => u._id === action.payload._id)) {
        state.onlineUsers.push(action.payload);
      }
    },
    removeUserOnline: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter((u) => u._id !== action.payload._id);
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
      if (action.payload) {
        const chatIndex = state.chats.findIndex(c => c._id === action.payload._id);
        if (chatIndex !== -1) {
          state.chats[chatIndex].unreadCount = 0;
        }
      }
    },
    addNotification: (state, action) => {
      if(!state.notification.find(n => n._id === action.payload._id)){
          state.notification.push(action.payload);
      }
    },
    removeNotification: (state, action) => {
      state.notification = state.notification.filter(n => n._id !== action.payload._id);
    },
    updateUserInChats: (state, action) => {
        const updatedUser = action.payload;
        // Update in chats list
        state.chats = state.chats.map(chat => {
            const updatedUsers = chat.users.map(u => u._id === updatedUser._id ? { ...u, ...updatedUser } : u);
            let updatedLatestMessage = chat.latestMessage;
             if (chat.latestMessage && chat.latestMessage.sender._id === updatedUser._id) {
                 updatedLatestMessage = { ...chat.latestMessage, sender: { ...chat.latestMessage.sender, ...updatedUser } };
             }
            return { ...chat, users: updatedUsers, latestMessage: updatedLatestMessage };
        });
        
        // Update selected chat
        if (state.selectedChat) {
             const updatedUsers = state.selectedChat.users.map(u => u._id === updatedUser._id ? { ...u, ...updatedUser } : u);
             state.selectedChat = { ...state.selectedChat, users: updatedUsers };
        }
    },
    updateChatLatestMessage: (state, action) => {
      const chatIndex = state.chats.findIndex(c => c._id === action.payload.chat._id || c._id === action.payload.chat);
      if (chatIndex !== -1) {
        state.chats[chatIndex].latestMessage = action.payload;
        if (!action.payload.isCurrentChat && action.payload.incrementUnread) {
          state.chats[chatIndex].unreadCount = (state.chats[chatIndex].unreadCount || 0) + 1;
        }
        const [updatedChat] = state.chats.splice(chatIndex, 1);
        state.chats.unshift(updatedChat);
      }
    },
    clearChatError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(accessChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(accessChat.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.chats.find((c) => c._id === action.payload._id)) {
          state.chats = [action.payload, ...state.chats];
        }
        state.selectedChat = action.payload;
      })
      .addCase(accessChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createGroupChat.fulfilled, (state, action) => {
        state.chats = [action.payload, ...state.chats];
        state.selectedChat = action.payload;
      })
      .addCase(renameGroup.fulfilled, (state, action) => {
        state.selectedChat = action.payload;
        const index = state.chats.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
            state.chats[index] = action.payload;
        }
      })
      .addCase(addToGroup.fulfilled, (state, action) => {
        state.selectedChat = action.payload;
        const index = state.chats.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
            state.chats[index] = action.payload;
        }
      })
      .addCase(removeFromGroup.fulfilled, (state, action) => {
        const chatIndex = state.chats.findIndex((c) => c._id === action.payload._id);
        if (chatIndex !== -1) {
          state.chats[chatIndex] = action.payload;
        }
        if (state.selectedChat?._id === action.payload._id) {
          state.selectedChat = action.payload;
        }
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.chats = state.chats.filter((c) => c._id !== action.payload.chatId);
        if (state.selectedChat?._id === action.payload.chatId) {
          state.selectedChat = null;
        }
      });
  },
});

export const {
  setSelectedChat,
  addNotification,
  removeNotification,
  setOnlineUsers,
  addUserOnline,
  removeUserOnline,
  updateChatLatestMessage,
  updateUserInChats,
  clearChatError,
} = chatSlice.actions;

export default chatSlice.reducer;

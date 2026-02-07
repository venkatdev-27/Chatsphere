import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import messageReducer from './slices/messageSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
  messages: messageReducer,
});

export default rootReducer;

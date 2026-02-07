import { io } from 'socket.io-client';
import { getToken } from '../utils/authHelper';

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace('/api', '');
  }
  return 'http://localhost:5000';
};

const ENDPOINT = getBaseUrl();

let socket;

export const connectSocket = () => {
  const token = getToken();
  if (token && !socket) {
    socket = io(ENDPOINT, {
      auth: { token },
      transports: ['websocket'],
    });
    console.log('Socket connecting... 🔌');
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return connectSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket disconnected ❌');
  }
};

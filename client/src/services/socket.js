import { io } from "socket.io-client";
import { getToken } from "../utils/authHelper";

let socket;

// 🔹 Get backend base URL (remove /api safely)
const getBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (apiUrl) {
    return apiUrl.replace(/\/api\/?$/, "");
  }

  return "http://localhost:5000";
};

const ENDPOINT = getBaseUrl();

export const connectSocket = () => {
  const token = getToken();

  // ✅ Prevent multiple connections
  if (!token || socket) return socket;

  socket = io(ENDPOINT, {
    auth: { token },

    // 🔥 IMPORTANT: prevent browser permission popup
    transports: ["websocket"],
    upgrade: false,

    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  console.log("🔌 Socket connected");

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("❌ Socket disconnected");
  }
};

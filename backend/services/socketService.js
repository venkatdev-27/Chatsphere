const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const {
  addUser,
  removeUser,
  getOnlineUsers,
} = require("./redisService");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        process.env.FRONTEND_URL,
      ].filter(Boolean),
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Auth token missing"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const User = require("../models/userModel");
      const user = await User.findById(decoded.id).select("-password");

      if (!user) return next(new Error("User not found"));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.user?._id?.toString();
    if (!userId) return;

    // 🔹 Safe Redis usage
    await addUser(userId, socket.id);

    socket.join(userId);

    io.emit("user_online", socket.user);

    try {
      const onlineUserIds = await getOnlineUsers();

      if (onlineUserIds.length) {
        const User = require("../models/userModel");
        const onlineUsers = await User.find({
          _id: { $in: onlineUserIds },
        }).select("-password");

        socket.emit("setup_online_users", onlineUsers);
      } else {
        socket.emit("setup_online_users", []);
      }
    } catch (err) {
      socket.emit("setup_online_users", []);
    }

    socket.on("join_room", (room) => {
      if (room) socket.join(room);
    });

    socket.on("send_message", (newMessageReceived) => {
      const chat = newMessageReceived?.chat;
      if (!chat?.users) return;

      chat.users.forEach((user) => {
        if (user._id.toString() === userId) return;

        socket
          .to(user._id.toString())
          .emit("receive_message", newMessageReceived);
      });
    });

    socket.on("disconnect", async () => {
      if (userId) {
        await removeUser(userId);
        io.emit("user_offline", socket.user);
      }
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

module.exports = { initSocket, getIO };

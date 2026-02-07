const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { addUser, removeUser, getUser, getOnlineUsers } = require('./redisService');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Frontend URL
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error: Token required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const User = require('../models/userModel');
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }
      
      socket.user = user; // Attach full user data to socket
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.user.id;

    await addUser(userId, socket.id);
    
    io.emit('user_online', socket.user); 

    const onlineUserIds = await getOnlineUsers();
    const User = require('../models/userModel');
    const onlineUsers = await User.find({ _id: { $in: onlineUserIds } }).select('-password');
    
    socket.emit('setup_online_users', onlineUsers);

    socket.join(userId);

    socket.on('join_room', (room) => {
      socket.join(room);
    });

    socket.on('send_message', (newMessageReceived) => {

      var chat = newMessageReceived.chat;

      if (!chat || !chat.users) return;  // console.log('Invalid chat or users');

      chat.users.forEach((user) => {
        if (user._id == newMessageReceived.sender._id) return;
        
        const recipientRoom = String(user._id);
        
        socket.in(recipientRoom).emit('receive_message', newMessageReceived);
      });
    });

    socket.on('disconnect', async () => {
      await removeUser(userId);
      io.emit('user_offline', socket.user); // Notify others with full user object or ID
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { initSocket, getIO };

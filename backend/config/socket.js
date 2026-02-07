const { Server } = require('socket.io');

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173', // Adjust to match frontend URL
      methods: ['GET', 'POST'],
      credentials: true
    },
  });

  io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('join_room', (data) => {
      socket.join(data);
      console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on('send_message', (data) => {
      socket.to(data.room).emit('receive_message', data);
    });

    socket.on('delete_message', (data) => {
      socket.to(data.room).emit('message_deleted', data);
    });

    socket.on('clear_chat', (data) => {
    });

    socket.on('disconnect', () => {
      console.log('User Disconnected', socket.id);
    });
  });

  return io;
};

module.exports = initSocket;

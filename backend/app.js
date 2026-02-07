const express = require('express');
const path = require('path');
const cors = require('cors');
const compression = require('compression');

const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const chatRoutes = require('./routes/chatRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(compression({ threshold: 1024 }));

const allowedOrigins = [
  'http://localhost:5173',                 // local frontend
  process.env.FRONTEND_URL                // production frontend (Render)
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('CORS not allowed'));
  },
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;

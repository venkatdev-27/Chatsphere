const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        return new Error('Redis connection failed');
      }
      return Math.min(retries * 50, 1000);
    }
  }
});

client.on('error', (err) => {
    if (err.code === 'ECONNREFUSED') {
    } else {
    }
});

client.on('connect', () => console.log('Redis Client Connected'));

const connectRedis = async () => {
  try {
    if (!client.isOpen) {
      await client.connect();
    }
  } catch (error) {
    
    console.warn('Redis connection failed. Features requiring Redis will be disabled.');
  }
};

module.exports = { client, connectRedis };

const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URI,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        console.error("Redis reconnect failed");
        return new Error("Redis connection failed");
      }
      return Math.min(retries * 100, 1000);
    },
  },
});

client.on("connect", () => {
  console.log("Redis Client Connected");
});

client.on("error", (err) => {
  console.error("Redis Error:", err.message);
});

const connectRedis = async () => {
  try {
    if (!client.isOpen) {
      await client.connect();
    }
  } catch (error) {
    console.warn("Redis connection failed. Redis features disabled.");
  }
};

const safeRedis = {
  async get(key) {
    if (!client.isOpen) return null;
    try {
      return await client.get(key);
    } catch (error) {
      console.warn(`Redis GET failed for key ${key}:`, error.message);
      return null;
    }
  },

  async setEx(key, ttlSeconds, value) {
    if (!client.isOpen) return false;
    try {
      await client.setEx(key, ttlSeconds, value);
      return true;
    } catch (error) {
      console.warn(`Redis SETEX failed for key ${key}:`, error.message);
      return false;
    }
  },

  async del(key) {
    if (!client.isOpen) return 0;
    try {
      return await client.del(key);
    } catch (error) {
      console.warn(`Redis DEL failed for key ${key}:`, error.message);
      return 0;
    }
  },
};

module.exports = { client, connectRedis, safeRedis };

const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URI, // ✅ FIXED (match .env)
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        console.error("❌ Redis reconnect failed");
        return new Error("Redis connection failed");
      }
      return Math.min(retries * 100, 1000);
    }
  }
});

client.on("connect", () => {
  console.log("✅ Redis Client Connected");
});

client.on("error", (err) => {
  console.error("❌ Redis Error:", err.message);
});

const connectRedis = async () => {
  try {
    if (!client.isOpen) {
      await client.connect();
    }
  } catch (error) {
    console.warn("⚠️ Redis connection failed. Redis features disabled.");
  }
};

module.exports = { client, connectRedis };

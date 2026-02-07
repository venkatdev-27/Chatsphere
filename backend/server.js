const http = require("http");
const dotenv = require("dotenv");

dotenv.config(); // load env FIRST

const connectDB = require("./config/db");
const app = require("./app");
const { initSocket } = require("./services/socketService");
const { connectRedis } = require("./config/redis");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    const server = http.createServer(app);

    initSocket(server);

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

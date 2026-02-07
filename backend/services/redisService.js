const { client } = require("../config/redis");

const isRedisReady = () => client?.isOpen;

const addUser = async (userId, socketId) => {
  try {
    if (!isRedisReady()) return;

    if (userId && socketId) {
      await client.set(`user:${userId}`, socketId);
      await client.sAdd("online_users", userId);
    }
  } catch (error) {
    console.error("Redis Add User Error:", error.message);
  }
};

const removeUser = async (userId) => {
  try {
    if (!isRedisReady()) return;

    if (userId) {
      await client.del(`user:${userId}`);
      await client.sRem("online_users", userId);
    }
  } catch (error) {
    console.error("Redis Remove User Error:", error.message);
  }
};

const getUser = async (userId) => {
  try {
    if (!isRedisReady()) return null;

    return await client.get(`user:${userId}`);
  } catch (error) {
    console.error("Redis Get User Error:", error.message);
    return null;
  }
};

const isUserOnline = async (userId) => {
  try {
    if (!isRedisReady()) return false;

    return await client.sIsMember("online_users", userId);
  } catch (error) {
    console.error("Redis Check Online Error:", error.message);
    return false;
  }
};

const getOnlineUsers = async () => {
  try {
    if (!isRedisReady()) return [];

    return await client.sMembers("online_users");
  } catch (error) {
    console.error("Redis Get Online Users Error:", error.message);
    return [];
  }
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  isUserOnline,
  getOnlineUsers,
};

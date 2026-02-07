const { client } = require('../config/redis');

const addUser = async (userId, socketId) => {
  try {
    if (userId && socketId) {
      await client.set(`user:${userId}`, socketId);
      await client.sAdd('online_users', userId);
    }
  } catch (error) {
    console.error('Redis Add User Error:', error);
  }
};

const removeUser = async (userId) => {
  try {
    if (userId) {
      await client.del(`user:${userId}`);
      await client.sRem('online_users', userId);
    }
  } catch (error) {
    console.error('Redis Remove User Error:', error);
  }
};

const getUser = async (userId) => {
  try {
    return await client.get(`user:${userId}`);
  } catch (error) {
    console.error('Redis Get User Error:', error);
    return null;
  }
};

const isUserOnline = async (userId) => {
  try {
    return await client.sIsMember('online_users', userId);
  } catch (error) {
    console.error('Redis Check Online Error:', error);
    return false;
  }
};

const getOnlineUsers = async () => {
  try {
    return await client.sMembers('online_users');
  } catch (error) {
    console.error('Redis Get Online Users Error:', error);
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

import axiosInstance from './axiosInstance';

export const fetchChatsAPI = async () => {
  const response = await axiosInstance.get('/chat');
  return response.data;
};

export const accessChatAPI = async (userId) => {
  const response = await axiosInstance.post('/chat', { userId });
  return response.data;
};

export const deleteChatAPI = async (chatId) => {
  const response = await axiosInstance.delete(`/chat/${chatId}`);
  return response.data;
};

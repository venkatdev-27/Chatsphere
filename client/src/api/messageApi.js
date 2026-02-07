import axiosInstance from './axiosInstance';

export const fetchMessagesAPI = async (chatId, limit = 20, before = null) => {
  let url = `/message/${chatId}?limit=${limit}`;
  if (before) {
    url += `&before=${before}`;
  }
  const response = await axiosInstance.get(url);
  return response.data;
};

export const sendMessageAPI = async (messageData) => {
  const isFormData = messageData instanceof FormData;
  const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};

  const response = await axiosInstance.post('/message', messageData, config);
  return response.data;
};

export const deleteMessageForMeAPI = async (messageId) => {
  const response = await axiosInstance.put('/message/deleteForMe', { messageId });
  return response.data;
};

export const deleteMessageForEveryoneAPI = async (messageId) => {
  const response = await axiosInstance.put('/message/deleteForEveryone', { messageId });
  return response.data;
};

export const clearChatAPI = async (chatId) => {
  const response = await axiosInstance.put('/message/clearChat', { chatId });
  return response.data;
};

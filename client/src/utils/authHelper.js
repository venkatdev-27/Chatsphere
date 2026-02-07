
const TOKEN_KEY = 'token';
const USER_KEY = 'userInfo';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthData = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUserInfo = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const removeAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const getProfilePicUrl = (picPath) => {
  if (!picPath) return "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  if (picPath.startsWith("http") || picPath.startsWith("https")) {
    return picPath;
  }
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  // Remove /api from the end of baseUrl if it exists, as uploads are usually at root
  const hostUrl = baseUrl.replace(/\/api\/?$/, "");
  return `${hostUrl}/${picPath}`;
};


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

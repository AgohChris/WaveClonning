
const USERS_KEY = 'wave_app_users';
const ACTIVE_USER_KEY = 'wave_app_active_user';

export const storageService = {
  getUsers: () => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  },
  saveUsers: (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },
  getActiveUser: () => {
    return localStorage.getItem(ACTIVE_USER_KEY);
  },
  setActiveUser: (userPhone) => {
    localStorage.setItem(ACTIVE_USER_KEY, userPhone);
  },
  clearActiveUser: () => {
    localStorage.removeItem(ACTIVE_USER_KEY);
  },
};

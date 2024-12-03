export const generateUserId = () => {
  return `user_${Math.random().toString(36).substring(2, 15)}`;
};
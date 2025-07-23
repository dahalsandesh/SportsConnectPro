export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error('Error parsing user from localStorage', e);
    return null;
  }
};

export const getUserId = (): string | null => {
  const user = getCurrentUser();
  return user?.userId || null;
};

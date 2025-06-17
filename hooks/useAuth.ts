import { useAppSelector } from '@/redux/store/hooks';

export const useAuth = () => {
  const { token, user, isAuthenticated, loading } = useAppSelector((state) => state.auth);
  
  return {
    user,
    token,
    isAuthenticated,
    isLoading: loading,
  };
};

export default useAuth;

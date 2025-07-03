import { useAppSelector } from "@/hooks/redux"

export const useAuth = () => {
  const { token, user, isAuthenticated, loading } = useAppSelector((state) => state.auth)

  return {
    user,
    token,
    isAuthenticated,
    isLoading: loading,
  }
}

export default useAuth

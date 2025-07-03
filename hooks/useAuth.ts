"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "./redux"
import { setCredentials, logout } from "@/redux/features/authSlice"

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { user, token, isAuthenticated, isLoading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    // Check for stored auth data on mount
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        console.log("useAuth - Restoring auth from localStorage:", {
          token: storedToken.substring(0, 20) + "...",
          user: {
            id: parsedUser.id,
            userType: parsedUser.userType,
            email: parsedUser.email,
          },
        })

        dispatch(
          setCredentials({
            user: parsedUser,
            token: storedToken,
          }),
        )
      } catch (error) {
        console.error("useAuth - Error parsing stored user data:", error)
        // Clear invalid data
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        dispatch(logout())
      }
    }
  }, [dispatch])

  const login = (userData: any, token: string) => {
    console.log("useAuth - Login called:", {
      user: {
        id: userData.id,
        userType: userData.userType,
        email: userData.email,
      },
      token: token.substring(0, 20) + "...",
    })

    // Store in localStorage
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(userData))

    // Update Redux state
    dispatch(
      setCredentials({
        user: userData,
        token,
      }),
    )
  }

  const logoutUser = () => {
    console.log("useAuth - Logout called")

    // Clear localStorage
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    // Update Redux state
    dispatch(logout())
  }

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout: logoutUser,
  }
}

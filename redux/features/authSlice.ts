import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { LoginResponse, UserType } from "@/types/auth"

interface AuthState {
  token: string | null
  user: {
    email: string | null
    userName: string | null
    fullName: string | null
    phoneNumber: string | null
    userType: UserType | null
  }
  isAuthenticated: boolean
  loading: boolean
}

const initialState: AuthState = {
  token: null,
  user: {
    email: null,
    userName: null,
    fullName: null,
    phoneNumber: null,
    userType: null,
  },
  isAuthenticated: false,
  loading: true,
}

// Check if we're in a browser environment and try to load from localStorage
if (typeof window !== "undefined") {
  const storedToken = localStorage.getItem("token")
  const storedUser = localStorage.getItem("user")

  if (storedToken && storedUser) {
    try {
      initialState.token = storedToken
      initialState.user = JSON.parse(storedUser)
      initialState.isAuthenticated = true
    } catch (error) {
      // If there's an error parsing the stored user, clear localStorage
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
  }
  initialState.loading = false
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<LoginResponse>) => {
      const { token, email, userName, fullName, phoneNumber, userType } = action.payload
      state.token = token
      state.user = {
        email,
        userName,
        fullName,
        phoneNumber,
        userType,
      }
      state.isAuthenticated = true
      state.loading = false

      // Save to localStorage if in browser
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(state.user))
      }
    },
    logout: (state) => {
      state.token = null
      state.user = {
        email: null,
        userName: null,
        fullName: null,
        phoneNumber: null,
        userType: null,
      }
      state.isAuthenticated = false
      state.loading = false

      // Remove from localStorage if in browser
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    },
    checkAuth: (state) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token")
        const user = localStorage.getItem("user")

        if (token && user) {
          try {
            state.token = token
            state.user = JSON.parse(user)
            state.isAuthenticated = true
          } catch (error) {
            // If there's an error parsing the stored user, clear localStorage
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            state.isAuthenticated = false
          }
        } else {
          state.isAuthenticated = false
        }
      }
      state.loading = false
    },
  },
})

export const { setCredentials, logout, checkAuth } = authSlice.actions
export default authSlice.reducer

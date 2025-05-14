import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { AuthState, AuthResponse } from "@/types/auth"

const initialState: AuthState = {
  user: {
    id: "",
    userName: "",
    email: "",
    userType: "NormalUsers",
    isVerified: false,
    createdAt: "",
    updatedAt: "",
  },
  token: null,
  isAuthenticated: false,
  loading: true,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      const { token, ...user } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true
      state.loading = false

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
      }
    },
    logout: (state) => {
      state.user = initialState.user
      state.token = null
      state.isAuthenticated = false
      state.loading = false

      // Remove from localStorage
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
          state.token = token
          state.user = JSON.parse(user)
          state.isAuthenticated = true
        }
      }
      state.loading = false
    },
  },
})

export const { setCredentials, logout, checkAuth } = authSlice.actions
export default authSlice.reducer

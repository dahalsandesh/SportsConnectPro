import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type {
  SignupRequest,
  SignupResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "@/types/auth"
import type { RootState } from "../store/reducers"

// Import the base URL utility
import { getBaseUrl } from "../baseApi"

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/web/api/v1/account/user`,
    prepareHeaders: (headers, { getState }) => {
      // Get token from state
      const token = (getState() as RootState).auth.token

      // If token exists, add authorization header
      if (token) {
        headers.set("Authorization", `token ${token}`)
      }

      return headers
    },
  }),
  endpoints: (builder) => ({
    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (credentials) => ({
        url: "/register",
        method: "POST",
        body: credentials,
      }),
    }),

    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),

    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),

    sendOtp: builder.mutation<SendOtpResponse, SendOtpRequest>({
      query: (data) => ({
        url: "/send-otp",
        method: "POST",
        body: data,
      }),
    }),

    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (data) => ({
        url: "/verify-otp",
        method: "POST",
        body: data,
      }),
    }),

    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
      query: (data) => ({
        url: "/changepassword",
        method: "POST",
        body: data,
      }),
    }),

    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (data) => ({
        url: "/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    activateAccount: builder.query<{ message: string }, { uid: string; token: string }>({
      query: ({ uid, token }) => ({
        url: `/activate/${uid}/${token}`,
        method: "GET",
      }),
    }),
  }),
})

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useLazyActivateAccountQuery,
} = authApi

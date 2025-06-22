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

    // Send OTP for password reset
    sendOtp: builder.mutation<SendOtpResponse, SendOtpRequest>({
      query: (data) => ({
        url: "/send-otp",
        method: "POST",
        body: data,
      }),
      // Store email in localStorage for later use
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          if (typeof window !== 'undefined') {
            localStorage.setItem('resetPasswordEmail', arg.email);
          }
        } catch (error) {
          // Handle error
        }
      },
    }),

    // Verify OTP for password reset
    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (data) => ({
        url: "/verify-otp",
        method: "POST",
        body: data,
      }),
      // Store OTP verification status in localStorage
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          if (typeof window !== 'undefined') {
            localStorage.setItem('otpVerified', 'true');
          }
        } catch (error) {
          // Handle error
        }
      },
    }),

    // Change password after OTP verification
    changePassword: builder.mutation<ChangePasswordResponse, Omit<ChangePasswordRequest, 'email'>>({
      query: (data) => {
        // Get email from localStorage - check both possible keys
        let email = '';
        if (typeof window !== 'undefined') {
          email = localStorage.getItem('otpVerifiedEmail') || 
                 localStorage.getItem('resetPasswordEmail') || 
                 '';
        }
        
        if (!email) {
          throw new Error('Email not found. Please restart the password reset process.');
        }
        
        return {
          url: "/changepassword",
          method: "POST",
          body: { 
            email,
            password: data.password,
            password1: data.password1 
          },
        };
      },
      // Clear stored data after successful password change
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          if (typeof window !== 'undefined') {
            localStorage.removeItem('resetPasswordEmail');
            localStorage.removeItem('otpVerified');
            localStorage.removeItem('otpVerifiedEmail');
          }
        } catch (error) {
          console.error('Error in changePassword onQueryStarted:', error);
          throw error;
        }
      },
    }),

    // Legacy forgot password endpoint (kept for backward compatibility)
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

import { baseApi } from "./baseApi"
import type { ApiResponse } from "@/types/api"

export interface UserProfile {
  firstName: string
  lastName: string
  profileImage: string
  email: string
  userName: string
  phoneNumber: string
}

export interface UpdateUserDetailsRequest {
  firstName: string
  lastName: string
  userName: string
  phoneNumber: string
}

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Admin profile endpoints
    getUserDetails: builder.query<UserProfile, string | void>({
      query: (userId) => ({
        url: "/web/api/v1/adminapp/GetUserDetails",
        params: userId ? { userId } : undefined,
      }),
      providesTags: ["Profile"],
    }),

    updateUserDetails: builder.mutation<ApiResponse<null>, UpdateUserDetailsRequest>({
      query: (data) => ({
        url: "/web/api/v1/adminapp/UpdateUserDetails",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    uploadProfileImage: builder.mutation<ApiResponse<null>, FormData>({
      query: (formData) => ({
        url: "/web/api/v1/adminapp/UploadProfileImage",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),

    // Venue owner profile endpoints
    getVenueUserDetails: builder.query<UserProfile, void>({
      query: () => "/web/api/v1/venue/GetUserDetails",
      providesTags: ["Profile"],
    }),

    updateVenueUserDetails: builder.mutation<ApiResponse<null>, UpdateUserDetailsRequest>({
      query: (data) => ({
        url: "/web/api/v1/venue/UpdateUserDetails",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    uploadVenueProfileImage: builder.mutation<ApiResponse<null>, FormData>({
      query: (formData) => ({
        url: "/web/api/v1/venue/UploadProfileImage",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
})

export const {
  useGetUserDetailsQuery,
  useUpdateUserDetailsMutation,
  useUploadProfileImageMutation,
  useGetVenueUserDetailsQuery,
  useUpdateVenueUserDetailsMutation,
  useUploadVenueProfileImageMutation,
} = profileApi

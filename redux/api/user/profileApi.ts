import { baseApi } from "../baseApi"
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
  endpoints: (builder: any) => ({
    // Admin profile endpoints
    getUserDetails: builder.query<UserProfile, string | void>({
      query: (userId: any) => ({
        url: "/web/api/v1/adminapp/GetUserDetails",
        params: userId ? { userId } : undefined,
      }),
      providesTags: ["Profile"],
    }),

    updateUserDetails: builder.mutation<ApiResponse<null>, UpdateUserDetailsRequest>({
      query: (data: any) => ({
        url: "/web/api/v1/adminapp/UpdateUserDetails",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    uploadProfileImage: builder.mutation<ApiResponse<null>, FormData>({
      query: (formData: any) => ({
        url: "/web/api/v1/adminapp/UploadProfileImage",
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
} = profileApi

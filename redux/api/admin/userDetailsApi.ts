import { baseApi } from "../baseApi";
import type { ApiResponse, UserDetails, UpdateUserDetailsRequest } from '@/types/api';

export const userDetailsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUserDetails: builder.query<UserDetails, void>({
      query: () => "/web/api/v1/adminapp/GetUserDetails",
      providesTags: ["UserDetails"],
    }),
    updateAdminUserDetails: builder.mutation<ApiResponse<null>, UpdateUserDetailsRequest>({
      query: (data) => ({
        url: "/web/api/v1/adminapp/UpdateUserData",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UserDetails"],
    }),
    uploadAdminProfileImage: builder.mutation<ApiResponse<null>, FormData>({
      query: (formData) => ({
        url: "/web/api/v1/adminapp/UploadProfileImage",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["UserDetails"],
    }),
  }),
});

export const {
    useGetAdminUserDetailsQuery,
    useUpdateAdminUserDetailsMutation,
    useUploadAdminProfileImageMutation,
} = userDetailsApi;

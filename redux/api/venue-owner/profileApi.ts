import { baseApi } from "../baseApi";
import type { ApiResponse, UserDetails, UpdateUserDetailsRequest } from '@/types/api';

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVenueUserDetails: builder.query<UserDetails, { statusId: string }>({
      query: (data) => ({
        url: "/web/api/v1/venue/GetUserDetails",
        method: "GET",
        body: data,
      }),
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
});

export const {
    useGetVenueUserDetailsQuery,
    useUpdateVenueUserDetailsMutation,
    useUploadVenueProfileImageMutation,
} = profileApi;

import { baseApi } from "../baseApi";
import type { ApiResponse, Reel, ReelDetails, UpdateReelRequest, DeleteReelRequest } from '@/types/api';

export const reelsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAdminReel: builder.mutation<ApiResponse<null>, FormData>({
      query: (formData) => ({
        url: "/web/api/v1/adminapp/CreateReel",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{type: "Reels", id: 'LIST'}],
    }),
    getAdminReels: builder.query<Reel[], string | undefined>({
      query: (userId) => {
        const query = new URLSearchParams();
        if (userId) {
          query.append('userId', userId);
        }
        return {
          url: `/web/api/v1/adminapp/GetReel?${query.toString()}`,
        };
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ reelId }) => ({ type: 'Reels' as const, id: reelId })), { type: 'Reels', id: 'LIST' }]
          : [{ type: 'Reels', id: 'LIST' }],
    }),
    getAdminReelDetails: builder.query<ReelDetails, string>({
      query: (reelId) => `/web/api/v1/adminapp/GetReelDetails?reelId=${reelId}`,
      providesTags: (result, error, id) => [{ type: "Reels", id }],
    }),
    updateAdminReel: builder.mutation<ApiResponse<null>, FormData>({
      query: (formData) => ({
        url: "/web/api/v1/adminapp/UpdateReel",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, formData) => [{ type: 'Reels', id: formData.get('reelId') as string }],
    }),
    deleteAdminReel: builder.mutation<ApiResponse<null>, DeleteReelRequest>({
      query: (data) => ({
        url: "/web/api/v1/adminapp/DelReel",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { reelId }) => [{ type: 'Reels', id: reelId }, {type: 'Reels', id: 'LIST'}],
    }),
  }),
});

// Export hooks with proper types
export const {
    useCreateAdminReelMutation,
    useGetAdminReelsQuery,
    useLazyGetAdminReelsQuery,
    useGetAdminReelDetailsQuery,
    useUpdateAdminReelMutation,
    useDeleteAdminReelMutation,
} = reelsApi;

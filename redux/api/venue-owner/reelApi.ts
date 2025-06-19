import { baseApi } from "../baseApi";
import type { ApiResponse, Reel, ReelDetails } from '@/types/api';

export const reelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReel: builder.mutation<ApiResponse<null>, FormData>({
      query: (formData) => ({
        url: "/web/api/v1/venue/CreateReel",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{type: "Reels", id: 'LIST'}],
    }),
    getReels: builder.query<Reel[], void>({
      query: () => "/web/api/v1/venue/GetReel",
      providesTags: (result) =>
        result
          ? [...result.map(({ reelId }) => ({ type: 'Reels' as const, id: reelId })), { type: 'Reels', id: 'LIST' }]
          : [{ type: 'Reels', id: 'LIST' }],
    }),
    getReelDetails: builder.query<ReelDetails, string>({
      query: (reelId) => ({
        url: "/web/api/v1/venue/GetReelDetails",
        params: { reelId },
      }),
      providesTags: (result, error, id) => [{ type: "Reels", id }],
    }),
    updateReel: builder.mutation<ApiResponse<null>, FormData>({
      query: (formData) => ({
        url: "/web/api/v1/venue/UpdateReel",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, formData) => [{ type: 'Reels', id: formData.get('reelId') as string }],
    }),
    deleteReel: builder.mutation<ApiResponse<null>, { reelId: string }>({
      query: ({ reelId }) => ({
        url: "/web/api/v1/venue/DelReel",
        method: "POST",
        body: { reelId },
      }),
      invalidatesTags: (result, error, { reelId }) => [{ type: 'Reels', id: reelId }, {type: 'Reels', id: 'LIST'}],
    }),
  }),
});

export const {
    useCreateReelMutation,
    useGetReelsQuery,
    useGetReelDetailsQuery,
    useUpdateReelMutation,
    useDeleteReelMutation,
} = reelApi;

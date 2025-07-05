import { baseApi } from "../baseApi";
import type { ApiResponse, Post, UpdatePostRequest } from '@/types/api';

export const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createVenuePost: builder.mutation<ApiResponse<null>, FormData>({
      query: (formData) => ({
        url: `/web/api/v1/venue/CreatePost`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{type: "Posts", id: 'LIST'}],
    }),
    getVenuePosts: builder.query<Post[], string>({
      query: (userId) => ({
        url: "/web/api/v1/venue/GetPost",
        params: { userId },
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ postID }) => ({ type: 'Posts' as const, id: postID })), { type: 'Posts', id: 'LIST' }]
          : [{ type: 'Posts', id: 'LIST' }],
    }),
    getVenuePostDetails: builder.query<Post, string>({
      query: (postId) => ({
        url: "/web/api/v1/venue/GetPostDetails",
        params: { postId },
      }),
      providesTags: (result, error, id) => [{ type: "Posts", id }],
    }),
    updateVenuePost: builder.mutation<ApiResponse<null>, FormData>({
      query: (formData) => ({
        url: "/web/api/v1/venue/UpdatePost",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, formData) => [{ type: 'Posts', id: formData.get('postId') as string }],
    }),
    deleteVenuePost: builder.mutation<ApiResponse<null>, { postId: string }>({
      query: ({ postId }) => ({
        url: "/web/api/v1/venue/DeletePost",
        method: "POST",
        body: { postId },
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: 'Posts', id: postId }, {type: 'Posts', id: 'LIST'}],
    }),
  }),
});

export const {
    useCreateVenuePostMutation,
    useGetVenuePostsQuery,
    useGetVenuePostDetailsQuery,
    useUpdateVenuePostMutation,
    useDeleteVenuePostMutation,
} = postApi;

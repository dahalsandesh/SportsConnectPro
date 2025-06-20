import { baseApi } from "../baseApi";
import type { ApiResponse, Post, UpdatePostRequest, DeletePostRequest } from '@/types/api';

export const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAdminPost: builder.mutation<ApiResponse<null>, FormData>({
      query: (formData) => ({
        url: "/web/api/v1/adminapp/CreatePost",
        method: "POST",
        body: formData,
     
      }),
      invalidatesTags: [{type: "Posts", id: 'LIST'}],
    }),
    getAdminPosts: builder.query<Post[], void>({
      query: () => "/web/api/v1/adminapp/GetPost",
      providesTags: (result) =>
        result
          ? [...result.map(({ postID }) => ({ type: 'Posts' as const, id: postID })), { type: 'Posts', id: 'LIST' }]
          : [{ type: 'Posts', id: 'LIST' }],
    }),
    getAdminPostDetails: builder.query<Post, string>({
      query: (postId) => `/web/api/v1/adminapp/v1/GetPostDetails?postId=${postId}`,
      providesTags: (result, error, id) => [{ type: "Posts", id }],
    }),
    updateAdminPost: builder.mutation<ApiResponse<null>, UpdatePostRequest>({
      query: (data) => ({
        url: "/web/api/v1/adminapp/v1/UpdatePost",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: 'Posts', id: postId }],
    }),
    deleteAdminPost: builder.mutation<ApiResponse<null>, DeletePostRequest>({
      query: (data) => ({
        url: "/web/api/v1/adminapp/v1/DelPost",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: 'Posts', id: postId }, {type: 'Posts', id: 'LIST'}],
    }),
  }),
});

export const {
    useCreateAdminPostMutation,
    useGetAdminPostsQuery,
    useGetAdminPostDetailsQuery,
    useUpdateAdminPostMutation,
    useDeleteAdminPostMutation,
} = postsApi;

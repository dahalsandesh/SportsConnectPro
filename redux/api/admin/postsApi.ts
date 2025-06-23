import { baseApi } from "../baseApi";
import type { ApiResponse, Post, UpdatePostRequest, DeletePostRequest } from '@/types/api';

export const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAdminPost: builder.mutation<ApiResponse<null>, { formData: FormData; userId: string }>({
      query: ({ formData, userId }) => {
        formData.append('userId', userId);
        return {
          url: "/web/api/v1/adminapp/CreatePost",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{type: "Posts", id: 'LIST'}],
    }),
    getAdminPosts: builder.query<Post[], string>({
      query: (userId) => ({
        url: '/web/api/v1/adminapp/GetPost',
        params: { userId }
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ postID }) => ({ type: 'Posts' as const, id: postID })),
              { type: 'Posts', id: 'LIST' },
            ]
          : [{ type: 'Posts', id: 'LIST' }],
    }),
    getAdminPostDetails: builder.query<Post, { postId: string; userId?: string }>({
      query: ({ postId, userId }) => {
        const query = new URLSearchParams();
        query.append('postId', postId);
        if (userId) {
          query.append('userId', userId);
        }
        return `/web/api/v1/adminapp/GetPostDetails?${query.toString()}`;
      },
      providesTags: (result, error, { postId }) => [{ type: "Posts", id: postId }],
    }),
    updateAdminPost: builder.mutation<ApiResponse<null>, { formData: FormData; postId: string; userId: string }>({
      query: ({ formData, postId, userId }) => {
        formData.append('postId', postId);
        formData.append('userId', userId);
        return {
          url: "/web/api/v1/adminapp/UpdatePost",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { postId }) => [{ type: 'Posts', id: postId }, { type: 'Posts', id: 'LIST' }],
    }),
    deleteAdminPost: builder.mutation<ApiResponse<null>, DeletePostRequest>({
      query: (data) => ({
        url: "/web/api/v1/adminapp/DelPost",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: 'Posts', id: postId }, { type: 'Posts', id: 'LIST' }],
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

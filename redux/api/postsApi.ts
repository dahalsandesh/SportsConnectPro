import { baseApi } from "./baseApi"
import type { ApiResponse } from "@/types/api"

export interface Post {
  postID: string
  title: string
  description: string
  category: string
  date: string
  time: string
  postImage: string
}

export interface CreatePostRequest {
  title: string
  description: string
  categoryId: string
  postImage?: File
}

export interface UpdatePostRequest {
  postId: string
  title: string
  description: string
  categoryId: string
  date: string
  time: string
  postImage?: string
}

export interface DeletePostRequest {
  postId: string
}

export const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Admin endpoints
    createPost: builder.mutation<ApiResponse<null>, FormData>({
      query: (formData) => ({
        url: "/web/api/v1/adminapp/CreatePost",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Posts"],
    }),

    getPosts: builder.query<Post[], string | void>({
      query: (userId) => ({
        url: "/web/api/v1/adminapp/GetPost",
        params: userId ? { userId } : undefined,
      }),
      providesTags: ["Posts"],
    }),

    getPostDetails: builder.query<Post, string>({
      query: (postId) => ({
        url: "/web/api/v1/adminapp/GetPostDetails",
        params: { postId },
      }),
      providesTags: (result, error, id) => [{ type: "Posts", id }],
    }),

    updatePost: builder.mutation<ApiResponse<null>, UpdatePostRequest>({
      query: (data) => ({
        url: "/web/api/v1/adminapp/UpdatePost",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Posts"],
    }),

    deletePost: builder.mutation<ApiResponse<null>, DeletePostRequest>({
      query: (data) => ({
        url: "/web/api/v1/adminapp/DelPost",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Posts"],
    }),

    // Venue owner endpoints
    createVenuePost: builder.mutation<ApiResponse<null>, FormData>({
      query: (formData) => ({
        url: "/web/api/v1/venue/CreatePost",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Posts"],
    }),

    getVenuePosts: builder.query<Post[], void>({
      query: () => "/web/api/v1/venue/GetPost",
      providesTags: ["Posts"],
    }),

    getVenuePostDetails: builder.query<Post, string>({
      query: (postId) => ({
        url: "/web/api/v1/venue/GetPostDetails",
        params: { postId },
      }),
      providesTags: (result, error, id) => [{ type: "Posts", id }],
    }),

    updateVenuePost: builder.mutation<ApiResponse<null>, UpdatePostRequest>({
      query: (data) => ({
        url: "/web/api/v1/venue/UpdatePost",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Posts"],
    }),

    deleteVenuePost: builder.mutation<ApiResponse<null>, DeletePostRequest>({
      query: (data) => ({
        url: "/web/api/v1/venue/DelPost",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Posts"],
    }),
  }),
})

export const {
  useCreatePostMutation,
  useGetPostsQuery,
  useGetPostDetailsQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
  useCreateVenuePostMutation,
  useGetVenuePostsQuery,
  useGetVenuePostDetailsQuery,
  useUpdateVenuePostMutation,
  useDeleteVenuePostMutation,
} = postsApi

import { baseApi } from "./baseApi";
import type { Post, Reel } from '@/types/api';

export const publicApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicPosts: builder.query<Post[], void>({
      query: () => "/web/api/v1/GetPost",
      providesTags: (result) =>
        result
          ? [...result.map(({ postID }) => ({ type: 'Posts' as const, id: postID })), { type: 'Posts', id: 'LIST' }]
          : [{ type: 'Posts', id: 'LIST' }],
    }),
    getPublicPostById: builder.query<Post, string>({
      query: (postID) => ({
        url: "/web/api/v1/GetPostById",
        params: { postId: postID },
      }),
      providesTags: (result, error, id) => [{ type: "Posts", id }],
    }),
    getPublicReels: builder.query<Reel[], void>({
      query: () => "/web/api/v1/GetReel",
    }),
    getPublicReelById: builder.query<Reel, string>({
      query: (reelId) => ({
        url: "/web/api/v1/GetReelById",
        params: { reelId },
      }),
    }),
  }),
});

export const {
  useGetPublicPostsQuery,
  useGetPublicPostByIdQuery,
  useGetPublicReelsQuery,
  useGetPublicReelByIdQuery,
} = publicApi;

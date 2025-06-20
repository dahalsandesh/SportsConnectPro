import { baseApi } from "./baseApi";
import type { Post, Reel } from '@/types/api';

// Create the public API slice
const publicApi = baseApi.injectEndpoints({
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
    getVenues: builder.query<any[], void>({
      query: () => "/web/api/v1/GetVenue",
      providesTags: (result) =>
        result
          ? [...result.map((venue: any) => ({ type: 'Venues' as const, id: venue.venueID })), { type: 'Venues', id: 'LIST' }]
          : [{ type: 'Venues', id: 'LIST' }],
    }),
    getVenueById: builder.query<any, string>({
      query: (venueId) => ({
        url: "/web/api/v1/GetVenueById",
        params: { venueId },
      }),
      providesTags: (result, error, id) => [{ type: "Venues", id }],
    }),
    getCourts: builder.query<any[], void>({
      query: () => "/web/api/v1/GetCourt",
      providesTags: (result) =>
        result
          ? [...result.map((court: any) => ({ type: 'Courts' as const, id: court.courtID })), { type: 'Courts', id: 'LIST' }]
          : [{ type: 'Courts', id: 'LIST' }],
    }),
    getCourtById: builder.query<any, string>({
      query: (courtId) => ({
        url: "/web/api/v1/GetCourtById",
        params: { courtId },
      }),
      providesTags: (result, error, id) => [{ type: "Courts", id }],
    }),
  }),
});

// Export the API slice and its hooks
export const {
  useGetPublicPostsQuery,
  useGetPublicPostByIdQuery,
  useGetPublicReelsQuery,
  useGetPublicReelByIdQuery,
  useGetVenuesQuery,
  useGetVenueByIdQuery,
  useGetCourtsQuery,
  useGetCourtByIdQuery,
} = publicApi;

export { publicApi };
export default publicApi;

import { baseApi } from "../baseApi";
import type { ApiResponse, Venue, VenueDetails, UpdateVenueDetailsRequest, VenueImage, VenueDashboardData } from '@/types/api';

export const venueApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVenueDetails: builder.query<VenueDetails, { userId?: string }>({ 
      query: (params = {}) => ({
        url: "/web/api/v1/venue/GetVenueDetails",
        params: params.userId ? { userId: params.userId } : {},
      }),
      providesTags: (result) => 
        result ? [{ type: 'Venues' as const, id: result.venueId }] : ['Venues'],
    }),
    updateVenueDetails: builder.mutation<ApiResponse<null>, UpdateVenueDetailsRequest>({ 
      query: (data) => ({
        url: `/web/api/v1/venue/UpdateVenueDetails`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Venues"],
    }),
    uploadVenueImage: builder.mutation<ApiResponse<null>, FormData>({ 
      query: (formData) => ({
        url: "/web/api/v1/venue/UploadVenueImage",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Venues"],
    }),
    deleteVenueImage: builder.mutation<ApiResponse<null>, { imageId: string }>({
      query: ({ imageId }) => ({
        url: `/web/api/v1/venue/DeleteVenueImage`,
        method: 'POST',
        body: { imageId },
      }),
      invalidatesTags: ['VenueImages'],
    }),
    getVenueDashboardData: builder.query<VenueDashboardData, void>({ 
      query: () => "/web/api/v1/venue/GetDashboardData",
      providesTags: ["Dashboard"],
    }),
    getVenues: builder.query<ApiResponse<Venue[]>, { userId: string }>({
      query: ({ userId }) => ({
        url: `/web/api/v1/venue/GetVenuesByOwner`,
        params: { userId },
      }),
      providesTags: (result) =>
        result && result.data
          ? [...result.data.map(({ venueId }) => ({ type: 'Venues' as const, id: venueId })), { type: 'Venues', id: 'LIST' }]
          : [{ type: 'Venues', id: 'LIST' }],
    }),
    getVenueImages: builder.query<VenueImage[], { venueId: string }>({
      query: ({ venueId }) => ({
        url: `/web/api/v1/venue/GetVenueImages`,
        params: { venueId },
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ imageId }) => ({ type: 'VenueImages' as const, id: imageId })), { type: 'VenueImages', id: 'LIST' }]
          : [{ type: 'VenueImages', id: 'LIST' }],
    }),
  }),
});

export const {
    useGetVenueDetailsQuery,
    useUpdateVenueDetailsMutation,
    useUploadVenueImageMutation,
    useDeleteVenueImageMutation,
    useGetVenueDashboardDataQuery,
    useGetVenuesQuery,
    useGetVenueImagesQuery
} = venueApi;

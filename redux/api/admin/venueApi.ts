import { baseApi } from "../baseApi";
import type { ApiResponse, Venue, CreateVenueRequest, UpdateVenueStatusRequest, VenueDetails } from '@/types/api';

export const venueApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminVenues: builder.query<Venue[], void>({ 
      query: () => "/web/api/v1/adminapp/GetVenue",
      providesTags: (result) =>
        result
          ? [...result.map(({ venueID }) => ({ type: 'Venues' as const, id: venueID })), { type: 'Venues', id: 'LIST' }]
          : [{ type: 'Venues', id: 'LIST' }],
    }),
    
    getVenueDetails: builder.query<VenueDetails, string>({
      query: (venueId) => `/web/api/v1/adminapp/GetVenueDetails?venueId=${venueId}`,
      providesTags: (result, error, id) => [{ type: 'Venues', id }],
    }),
    
    createVenue: builder.mutation<ApiResponse<null>, CreateVenueRequest>({
      query: (data) => ({
        url: "/web/api/v1/adminapp/CreateVenue",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: 'Venues', id: 'LIST' }],
    }),
    
    updateVenueStatus: builder.mutation<ApiResponse<null>, UpdateVenueStatusRequest>({
      query: (data) => ({
        url: "/web/api/v1/adminapp/UpdateVenueStatus",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { venueId }) => [{ type: 'Venues', id: venueId }],
    }),
  }),
});

export const {
    useGetAdminVenuesQuery,
    useGetVenueDetailsQuery,
    useCreateVenueMutation,
    useUpdateVenueStatusMutation,
} = venueApi;

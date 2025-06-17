import { baseApi } from "../baseApi";
import type { ApiResponse, Venue, CreateVenueRequest, UpdateVenueStatusRequest } from '@/types/api';

export const venueApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVenues: builder.query<ApiResponse<Venue[]>, void>({ 
      query: () => "/web/api/v1/adminapp/GetAllVenues",
      providesTags: (result) =>
        result && result.data
          ? [...result.data.map(({ venueId }) => ({ type: 'Venues' as const, id: venueId })), { type: 'Venues', id: 'LIST' }]
          : [{ type: 'Venues', id: 'LIST' }],
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
    useGetVenuesQuery,
    useCreateVenueMutation,
    useUpdateVenueStatusMutation,
} = venueApi;

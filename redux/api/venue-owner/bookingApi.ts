import { baseApi } from "../baseApi";
import type { ApiResponse, VenueBooking, VenueBookingDetails, UpdateVenueBookingStatusRequest } from '@/types/api';

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVenueBookings: builder.query<VenueBooking[], { courtId: string; startDate: string; endDate: string }>({
      query: ({ courtId, startDate, endDate }) => ({
        url: "/web/api/v1/venue/GetBooking",
        params: { courtId, startDate, endDate },
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ bookingId }) => ({ type: 'Bookings' as const, id: bookingId })), { type: 'Bookings', id: 'LIST' }]
          : [{ type: 'Bookings', id: 'LIST' }],
    }),
    getVenueBookingById: builder.query<VenueBookingDetails, { bookingId: string }>({
      query: ({ bookingId }) => ({
        url: "/web/api/v1/venue/GetBookingById",
        params: { bookingId },
      }),
      providesTags: (result, error, { bookingId }) => [{ type: 'Bookings', id: bookingId }],
    }),
    updateVenueBookingStatus: builder.mutation<ApiResponse<null>, UpdateVenueBookingStatusRequest>({
      query: (data) => ({
        url: "/web/api/v1/venue/UpdateBookingStatus",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { bookingId }) => [{ type: 'Bookings', id: bookingId }],
    }),
  }),
});

export const {
    useGetVenueBookingsQuery,
    useGetVenueBookingByIdQuery,
    useUpdateVenueBookingStatusMutation,
} = bookingApi;

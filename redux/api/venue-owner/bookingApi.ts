import { baseApi } from "../baseApi";
import type { ApiResponse, VenueBooking, VenueBookingDetails, UpdateVenueBookingStatusRequest } from '@/types/api';

const AUTH_HEADER_KEY = 'Authorization';

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVenueBookings: builder.query<VenueBooking[], { courtId: string; startDate: string; endDate: string; token: string }>({
      query: ({ courtId, startDate, endDate, token }) => ({
        url: "/web/api/v1/venue/GetBooking",
        params: { courtId, startDate, endDate },
        headers: { [AUTH_HEADER_KEY]: token },
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ bookingId }) => ({ type: 'Bookings' as const, id: bookingId })), { type: 'Bookings', id: 'LIST' }]
          : [{ type: 'Bookings', id: 'LIST' }],
    }),
    getVenueBookingById: builder.query<VenueBookingDetails, { bookingId: string; token: string }>({
      query: ({ bookingId, token }) => ({
        url: "/web/api/v1/venue/GetBookingById",
        params: { bookingId },
        headers: { [AUTH_HEADER_KEY]: token },
      }),
      providesTags: (result, error, { bookingId }) => [{ type: 'Bookings', id: bookingId }],
    }),
    updateVenueBookingStatus: builder.mutation<ApiResponse<null>, UpdateVenueBookingStatusRequest & { token: string }>({
      query: ({ token, ...data }) => ({
        url: "/web/api/v1/venue/UpdateBookingStatus",
        method: "POST",
        body: data,
        headers: { [AUTH_HEADER_KEY]: token },
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

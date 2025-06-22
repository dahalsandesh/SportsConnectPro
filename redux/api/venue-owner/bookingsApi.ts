import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/redux/store";
import { getBaseUrl } from "../baseApi";
import type { ApiResponse, Booking } from "@/types/api";

// Define tag types for cache invalidation
export const VENUE_OWNER_BOOKINGS_TAG = 'VenueOwnerBookings' as const;
type VenueOwnerBookingTag = { 
  type: typeof VENUE_OWNER_BOOKINGS_TAG; 
  id: string | 'LIST' | 'UPCOMING' | 'PAST' | 'PENDING' | 'CONFIRMED' | 'CANCELLED';
};

export interface VenueOwnerBooking extends Booking {
  bookerName: string;
  bookerEmail: string;
  courtName: string;
  venueName: string;
  paymentStatus: string;
  bookingDate: string;
  timeSlot: string;
}

export interface UpdateBookingStatusRequest {
  bookingId: string;
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REJECTED';
  cancellationReason?: string;
}

// Create the venue owner bookings API
export const venueOwnerBookingsApi = createApi({
  reducerPath: 'venueOwnerBookingsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [VENUE_OWNER_BOOKINGS_TAG],
  endpoints: (builder) => ({
    // Get all bookings for the venue owner's venues
    getVenueOwnerBookings: builder.query<VenueOwnerBooking[], void>({
      query: () => '/web/api/v1/venue-owner/bookings',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ bookingId }) => ({ type: VENUE_OWNER_BOOKINGS_TAG, id: bookingId } as const)),
              { type: VENUE_OWNER_BOOKINGS_TAG, id: 'LIST' },
            ]
          : [{ type: VENUE_OWNER_BOOKINGS_TAG, id: 'LIST' }],
    }),

    // Get upcoming bookings
    getUpcomingBookings: builder.query<VenueOwnerBooking[], void>({
      query: () => '/web/api/v1/venue-owner/bookings/upcoming',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ bookingId }) => ({ type: VENUE_OWNER_BOOKINGS_TAG, id: bookingId } as const)),
              { type: VENUE_OWNER_BOOKINGS_TAG, id: 'UPCOMING' },
            ]
          : [{ type: VENUE_OWNER_BOOKINGS_TAG, id: 'UPCOMING' }],
    }),

    // Get past bookings
    getPastBookings: builder.query<VenueOwnerBooking[], void>({
      query: () => '/web/api/v1/venue-owner/bookings/past',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ bookingId }) => ({ type: VENUE_OWNER_BOOKINGS_TAG, id: bookingId } as const)),
              { type: VENUE_OWNER_BOOKINGS_TAG, id: 'PAST' },
            ]
          : [{ type: VENUE_OWNER_BOOKINGS_TAG, id: 'PAST' }],
    }),

    // Update booking status
    updateBookingStatus: builder.mutation<ApiResponse<VenueOwnerBooking>, UpdateBookingStatusRequest>({
      query: ({ bookingId, ...body }) => ({
        url: `/web/api/v1/venue-owner/bookings/${bookingId}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { bookingId }) => [
        { type: VENUE_OWNER_BOOKINGS_TAG, id: bookingId },
        { type: VENUE_OWNER_BOOKINGS_TAG, id: 'LIST' },
        { type: VENUE_OWNER_BOOKINGS_TAG, id: 'UPCOMING' },
        { type: VENUE_OWNER_BOOKINGS_TAG, id: 'PAST' },
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetVenueOwnerBookingsQuery,
  useGetUpcomingBookingsQuery,
  useGetPastBookingsQuery,
  useUpdateBookingStatusMutation,
} = venueOwnerBookingsApi;

// Export the API instance for potential direct usage
export default venueOwnerBookingsApi;

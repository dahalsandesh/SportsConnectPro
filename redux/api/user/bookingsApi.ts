import { createApi, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../../store/reducers"
import { getBaseUrl } from "../baseApi"
import type { ApiResponse, PaginatedResponse } from "@/types/api"

// Define tag types for cache invalidation
export const BOOKINGS_TAG = 'Bookings' as const
type BookingTag = { 
  type: typeof BOOKINGS_TAG; 
  id: string | 'LIST' | 'UPCOMING' | 'PAST' | 'PENDING' | 'CANCELLED' 
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  pricePerHour?: number;
}

export interface Court {
  courtId: string;
  courtName: string;
  sportType: {
    sportTypeId: string;
    name: string;
  };
  venueId: string;
  venueName: string;
  description?: string;
  isActive: boolean;
  isIndoor: boolean;
  capacity?: number;
  floorType?: string;
  timeSlots: TimeSlot[];
  images: string[];
  amenities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  bookingId: string;
  court: Court;
  userId: string;
  userName: string;
  userEmail: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REJECTED';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';
  paymentMethod?: string;
  paymentId?: string;
  cancellationReason?: string;
  cancelledBy?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingRequest {
  courtId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  paymentMethod: string;
  promoCode?: string;
}

export interface UpdateBookingStatusRequest {
  id: string;
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REJECTED';
  cancellationReason?: string;
}

export interface BookingResponse {
  message: string;
  data?: Booking;
}

// Venue owner booking interface
export interface VenueOwnerBooking {
  bookingId: string;
  BookerName: string;
  status: string;
  paymentMethod: string;
  totalPrice: number | null;
  bookDate: string;
  timeSlot: string;
}

// Helper function to handle API responses
const handleApiResponse = <T,>(
  response: ApiResponse<T> | undefined,
  defaultValue: T
): T => {
  if (!response) return defaultValue;
  if ('error' in response) {
    console.error('API Error:', response.error);
    return defaultValue;
  }
  return response.data || defaultValue;
};

// Create the bookings API
export const bookingsApi = createApi({
  reducerPath: 'bookingsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `token ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [BOOKINGS_TAG],
  endpoints: (builder) => ({
    // Get bookings for a specific court and date range (Venue Owner)
    getVenueCourtBookings: builder.query<VenueOwnerBooking[], { courtId: string; startDate: string; endDate: string }>({
      query: ({ courtId, startDate, endDate }) => ({
        url: '/web/api/v1/venue/GetBooking',
        params: { courtId, startDate, endDate },
      }),
      providesTags: (result = []) => [
        ...(result?.map(({ bookingId }) => ({ type: BOOKINGS_TAG, id: bookingId } as const)) || []),
        { type: BOOKINGS_TAG, id: 'VENUE_COURT' },
      ],
      transformResponse: (response: any) => response || []
    }),

    // Get booking by ID
    getBookingById: builder.query<Booking, string>({
      query: (bookingId) => ({
        url: '/web/api/v1/venue/GetBookingById',
        params: { bookingId },
      }),
      providesTags: (result, error, bookingId) => [
        { type: BOOKINGS_TAG, id: bookingId },
      ]
    }),

    // Create a new booking (Not available in venue owner API)
    createBooking: builder.mutation<{ success: boolean }, any>({
      query: () => ({ url: '', method: 'POST' }),
      invalidatesTags: [{ type: BOOKINGS_TAG, id: 'LIST' }],
    }),

    // Update booking status
    updateBookingStatus: builder.mutation<BookingResponse, UpdateBookingStatusRequest>({
      query: ({ id, status, cancellationReason }) => ({
        url: `UpdateBookingStatus`,
        method: 'POST',
        body: { bookingId: id, status, cancellationReason },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: BOOKINGS_TAG, id },
        { type: BOOKINGS_TAG, id: 'LIST' },
        { type: BOOKINGS_TAG, id: 'UPCOMING' },
        { type: BOOKINGS_TAG, id: 'PAST' },
      ],
      transformResponse: (response: ApiResponse<BookingResponse>) =>
        handleApiResponse(response, { message: 'Booking status updated successfully' }),
      transformErrorResponse: (response: FetchBaseQueryError) => {
        console.error('Update booking status error:', response);
        return response;
      },
    }),

    // Get current user's bookings
    getMyBookings: builder.query<BookingsResponse, { 
      page?: number;
      limit?: number;
      status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REJECTED';
    } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        const safeParams = params || {};
        const { page = 1, limit = 10, status } = safeParams as {
          page?: number;
          limit?: number;
          status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REJECTED';
        };
        
        queryParams.append('page', page.toString());
        queryParams.append('limit', limit.toString());
        if (status) queryParams.append('status', status);
        
        return {
          url: `bookings/me?${queryParams.toString()}`,
        };
      },
      providesTags: (result) => {
        const tags: BookingTag[] = [
          { type: BOOKINGS_TAG, id: 'MY_BOOKINGS' },
          { type: BOOKINGS_TAG, id: 'UPCOMING' }
        ];
        
        if (result?.data) {
          result.data.forEach(booking => {
            if (booking.bookingId) {
              tags.push({ type: BOOKINGS_TAG, id: booking.bookingId });
            }
          });
        }
        
        return tags;
      },
      transformResponse: (response: ApiResponse<BookingsResponse> | undefined) =>
        handleApiResponse<BookingsResponse>(
          response,
          { data: [], total: 0, page: 1, limit: 10, totalPages: 0 }
        ),
    }),

    // Get bookings for a specific venue
    getVenueBookings: builder.query<BookingsResponse, { 
      venueId: string;
      page?: number;
      limit?: number;
      status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REJECTED';
      dateFrom?: string;
      dateTo?: string;
    }>({
      query: ({ venueId, ...params }) => {
        const queryParams = new URLSearchParams();
        
        queryParams.append('page', (params.page || 1).toString());
        queryParams.append('limit', (params.limit || 10).toString());
        if (params.status) queryParams.append('status', params.status);
        if (params.dateFrom) queryParams.append('fromDate', params.dateFrom);
        if (params.dateTo) queryParams.append('toDate', params.dateTo);
        
        return {
          url: `venues/${venueId}/bookings?${queryParams.toString()}`,
        };
      },
      providesTags: (result, error, { venueId }) => {
        const tags: BookingTag[] = [
          { type: BOOKINGS_TAG, id: `VENUE_${venueId}_BOOKINGS` },
          { type: BOOKINGS_TAG, id: 'LIST' }
        ];
        
        if (result?.data) {
          result.data.forEach(booking => {
            tags.push({ type: BOOKINGS_TAG, id: booking.bookingId });
          });
        }
        
        return tags;
      },
      transformResponse: (response: ApiResponse<BookingsResponse>) =>
        handleApiResponse(response, { data: [], total: 0, page: 1, limit: 10, totalPages: 0 }),
    }),

    // Get all bookings for a court with date range
    getBookingsForCourt: builder.query<BookingsResponse, {
      courtId: string;
      startDate: string;
      endDate: string;
    }>({
      query: ({ courtId, startDate, endDate }) => ({
        url: `GetBooking`,
        params: { courtId, startDate, endDate },
      }),
      providesTags: (result) => {
        const tags: BookingTag[] = [{ type: BOOKINGS_TAG, id: 'LIST' }];
        if (result?.data) {
          result.data.forEach(booking => {
            tags.push({ type: BOOKINGS_TAG, id: booking.bookingId });
            tags.push({ type: BOOKINGS_TAG, id: booking.status });
          });
        }
        return tags;
      },
      transformResponse: (response: ApiResponse<BookingsResponse>) =>
        handleApiResponse(response, { data: [], total: 0, page: 1, limit: 10, totalPages: 0 })
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetMyBookingsQuery,
  useGetBookingByIdQuery,
  useCreateBookingMutation,
  useUpdateBookingStatusMutation,
  useGetVenueCourtBookingsQuery,
} = bookingsApi;

/**
 * Custom hook for canceling a booking
 * @returns A function that cancels a booking by ID with an optional reason
 */
export const useCancelBooking = () => {
  const [updateStatus] = useUpdateBookingStatusMutation();
  
  return async (bookingId: string, reason?: string) => {
    try {
      const result = await updateStatus({
        id: bookingId,
        status: 'CANCELLED',
        cancellationReason: reason,
      }).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      throw error;
    }
  };
};

// Export types for components
export type { FetchBaseQueryError as ApiError };

// Export the API instance for potential direct usage
export default bookingsApi;

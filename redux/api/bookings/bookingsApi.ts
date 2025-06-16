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

// Extend the base PaginatedResponse to include totalPages
export interface BookingsResponse extends PaginatedResponse<Booking> {
  data: Booking[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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
    baseUrl: `${getBaseUrl()}/web/api/v1/venue`,
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
    // Get all bookings with optional filters
    getBookings: builder.query<BookingsResponse, { 
      page?: number; 
      limit?: number; 
      status?: 'PENDING' | 'CANCELLED' | 'CONFIRMED' | 'COMPLETED' | 'REJECTED';
      sortBy?: 'bookingDate' | 'createdAt' | 'totalAmount';
      sortOrder?: 'asc' | 'desc';
      search?: string;
      fromDate?: string;
      toDate?: string;
    }>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.status) queryParams.append('status', params.status);
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
        if (params.search) queryParams.append('search', params.search);
        if (params.fromDate) queryParams.append('fromDate', params.fromDate);
        if (params.toDate) queryParams.append('toDate', params.toDate);
        
        return {
          url: `bookings?${queryParams.toString()}`,
        };
      },
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

    // Get booking by ID
    getBookingById: builder.query<Booking, string>({
      query: (bookingId) => ({
        url: `GetBookingById`,
        params: { bookingId },
      }),
      providesTags: (result, error, bookingId) => [
        { type: BOOKINGS_TAG, id: bookingId },
      ],
      transformResponse: (response: ApiResponse<Booking>) =>
        handleApiResponse(response, {} as Booking)
    }),

    // Create a new booking
    createBooking: builder.mutation<BookingResponse, CreateBookingRequest>({
      query: (bookingData) => ({
        url: 'bookings',
        method: 'POST',
        body: bookingData,
      }),
      invalidatesTags: (result, error, booking) => [
        { type: BOOKINGS_TAG, id: 'LIST' },
        { type: BOOKINGS_TAG, id: 'UPCOMING' },
      ],
      transformResponse: (response: ApiResponse<BookingResponse>) => 
        handleApiResponse(response, { message: 'Booking created successfully' }),
      transformErrorResponse: (response: FetchBaseQueryError) => {
        console.error('Create booking error:', response);
        return response;
      },
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
  useGetBookingsQuery,
  useGetBookingByIdQuery,
  useCreateBookingMutation,
  useUpdateBookingStatusMutation,
  useGetMyBookingsQuery,
  useGetVenueBookingsQuery,
  useGetBookingsForCourtQuery,
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

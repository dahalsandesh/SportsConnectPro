import { baseApi } from "../baseApi"
import type { ApiResponse, PaginatedResponse } from "@/types/api"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"

// Define the tag type for this API
type BookingTag = { type: 'Bookings', id: string | 'LIST' | 'UPCOMING' | 'PAST' | 'PENDING' | 'CANCELLED' }

// Helper type for tag arrays
type TagArray<T> = Array<T | { type: T; id: string | number }>

// Helper function to handle API responses and errors
const handleApiResponse = <T,>(response: any, defaultValue: T): T => {
  if (!response) return defaultValue;
  if (response.error) {
    console.error('API Error:', response.error);
    return defaultValue;
  }
  
  // If no data, return default value
  if (!response.data) return defaultValue;
  
  // Handle paginated responses
  if (typeof response.data === 'object' && 'total' in response.data) {
    const total = response.data.total || 0;
    const limit = response.data.limit || 10;
    const page = response.data.page || 1;
    const totalPages = response.data.totalPages || Math.ceil(total / limit);
    
    return {
      data: response.data.data || [],
      total,
      page,
      limit,
      totalPages
    } as unknown as T; // Cast to unknown first to avoid type errors
  }
  
  // For non-paginated responses, return the data as is
  return response.data;
};

// Type for transformed query response
type QueryResponse<T, Default = T | null> = {
  data: T | Default;
  error?: FetchBaseQueryError;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
};

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
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REJECTED';
  cancellationReason?: string;
}

export interface BookingResponse {
  message: string;
  data?: Booking;
}

// Extend the base PaginatedResponse to include totalPages
export interface BookingsResponse extends PaginatedResponse<Booking> {
  // The base PaginatedResponse already includes totalPages
  data: Booking[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const bookingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all bookings with filters
    getBookings: builder.query<BookingsResponse, {
      page?: number;
      limit?: number;
      status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REJECTED';
      sortBy?: 'bookingDate' | 'createdAt' | 'totalAmount';
      sortOrder?: 'asc' | 'desc';
      userId?: string;
      courtId?: string;
      venueId?: string;
      fromDate?: string;
      toDate?: string;
    }>({
      query: (params) => {
        const queryParams = params || {};
        return {
          url: "/web/api/v1/bookings",
          params: queryParams as Record<string, any>,
        };
      },
      providesTags: (result): TagArray<'Bookings'> => {
        const tags: TagArray<'Bookings'> = [
          { type: 'Bookings', id: 'LIST' },
        ];
        
        if (result?.data) {
          tags.push(
            ...result.data.map<BookingTag>(({ bookingId, status }) => ({
              type: 'Bookings',
              id: bookingId,
            }))
          );
          
          // Add status-based tags
          const statusTags = result.data.reduce((acc, { status }) => {
            if (!acc.includes(status)) {
              acc.push(status);
            }
            return acc;
          }, [] as string[]);
          
          statusTags.forEach(status => {
            tags.push({ type: 'Bookings', id: status });
          });
        }
        
        return tags;
      }),

    // Get booking by ID
    getBookingById: builder.query<Booking, string>({
      query: (id) => ({
        url: `/web/api/v1/bookings/${id}`,
      }),
      providesTags: (result, error, id): TagArray<'Bookings'> => [
        { type: 'Bookings', id },
      ],
    }),

    // Create a new booking
    createBooking: builder.mutation<BookingResponse, CreateBookingRequest>({
      query: (data) => ({
        url: "/web/api/v1/bookings",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (): TagArray<'Bookings'> => [
        { type: 'Bookings', id: 'LIST' },
        { type: 'Bookings', id: 'PENDING' },
        { type: 'Bookings', id: 'UPCOMING' },
      ],
      transformErrorResponse: (response) => {
        console.error('Create booking error:', response);
        return response;
      },
    }),

    // Cancel a booking (for user)
    updateBookingStatus: builder.mutation<BookingResponse, { id: string } & UpdateBookingStatusRequest>({
      query: ({ id, ...data }) => ({
        url: `/web/api/v1/bookings/${id}/status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id, status }): TagArray<'Bookings'> => [
        { type: 'Bookings', id },
        { type: 'Bookings', id: 'LIST' },
        { type: 'Bookings', id: status },
        { type: 'Bookings', id: 'UPCOMING' },
        { type: 'Bookings', id: 'PAST' },
      ],
      transformErrorResponse: (response) => {
        console.error('Cancel booking error:', response);
        return response;
      },
    }),

    // Get user's bookings
    getMyBookings: builder.query<BookingsResponse, { 
      page?: number;
      limit?: number;
      status?: string;
    }>({
      query: (params = {}) => ({
        url: "/web/api/v1/bookings/me",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          ...(params.status && { status: params.status }),
        },
      }),
      transformResponse: (response: ApiResponse<BookingsResponse> | null) =>
        handleApiResponse<BookingsResponse>(
          response, 
          { data: [], total: 0, page: 1, limit: 10, totalPages: 0 }
        ),
      providesTags: (result): TagArray<'Bookings'> => {
        const tags: TagArray<'Bookings'> = [
          { type: 'Bookings', id: 'MY_BOOKINGS' },
        ];
        
        if (result?.data) {
          tags.push(
            ...result.data.map<BookingTag>(({ bookingId }) => ({
              type: 'Bookings',
              id: bookingId,
            }))
          );
        }
        
        return tags;
      },
    }),

    // Get venue owner's bookings
    getVenueBookings: builder.query<BookingsResponse, { 
      venueId: string;
      page?: number;
      limit?: number;
      status?: string;
      dateFrom?: string;
      dateTo?: string;
    }>({
      query: ({ venueId, ...params }) => ({
        url: `/web/api/v1/venues/${venueId}/bookings`,
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          ...(params.status && { status: params.status }),
          ...(params.dateFrom && { dateFrom: params.dateFrom }),
          ...(params.dateTo && { dateTo: params.dateTo }),
        },
      }),
      transformResponse: (response: ApiResponse<BookingsResponse> | null) =>
        handleApiResponse<BookingsResponse>(
          response,
          { data: [], total: 0, page: 1, limit: 10, totalPages: 0 }
        ),
      providesTags: (result, error, { venueId }): TagArray<'Bookings'> => {
        const tags: TagArray<'Bookings'> = [
          { type: 'Bookings', id: `VENUE_${venueId}_BOOKINGS` },
        ];
        
        if (result?.data) {
          tags.push(
            ...result.data.map<BookingTag>(({ bookingId }) => ({
              type: 'Bookings',
              id: bookingId,
            }))
          );
        }
        
        return tags;
      },
    }),
  }),
  overrideExisting: false,
});

// Export hooks for usage in components
export const {
  useGetBookingsQuery,
  useGetBookingByIdQuery,
  useCreateBookingMutation,
  useUpdateBookingStatusMutation,
  useGetMyBookingsQuery,
  useGetVenueBookingsQuery,
} = bookingsApi;

// Export cancel booking mutation
export const useCancelBooking = () => {
  const [updateStatus] = bookingsApi.useUpdateBookingStatusMutation();
  
  const cancelBooking = async (id: string, reason?: string) => {
    return updateStatus({
      id,
      status: 'CANCELLED',
      ...(reason && { cancellationReason: reason })
    });
  };
  
  return cancelBooking;
};

// Export types for components
export type { QueryResponse, FetchBaseQueryError as ApiError };

// Export the API instance for potential direct usage
export default bookingsApi;

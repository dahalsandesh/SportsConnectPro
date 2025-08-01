import { baseApi } from "./baseApi";
import type { Post, Reel, Court, Event, TimeSlot, PaymentType } from '@/types/api';

// Create the public API slice
const publicApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({

    // Get public events for homepage
    getEvents: builder.query<Event[], void>({
      query: () => "/web/api/v1/GetEvent",
      providesTags: (result) =>
        result
          ? [...result.map(({ eventId }) => ({ type: 'Events' as const, id: eventId })), { type: 'Events', id: 'LIST' }]
          : [{ type: 'Events', id: 'LIST' }],
    }),
    // Get single event by ID
    getEventById: builder.query<Event, string>({
      query: (eventId) => ({
        url: "/web/api/v1/GetEventById",
        params: { eventId },
      }),
      providesTags: (result, error, id) => [{ type: 'Events', id }],
    }),
    // Get dynamic homepage stats
    getCountData: builder.query<any, void>({
      query: () => "/web/api/v1/GetCountData",
    }),
    // Get tickets (time slots) for a court and date (public)
    getTickets: builder.query<TimeSlot[], { courtId: string; date: string }>({
      query: ({ courtId, date }) => {
        // Ensure courtId is properly encoded
        const params = new URLSearchParams();
        params.append('courtId', courtId);
        params.append('date', date);
        
        return {
          url: "/web/api/v1/GetTicket",
          params: Object.fromEntries(params),
        };
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'TimeSlots' as const, id })), { type: 'TimeSlots', id: 'LIST' }]
          : [{ type: 'TimeSlots', id: 'LIST' }],
    }),
    // Get available payment types
    getPaymentTypes: builder.query<PaymentType[], void>({
      query: () => "/web/api/v1/GetPaymentType",
      providesTags: [{ type: 'PaymentTypes', id: 'LIST' }],
    }),
    
    // Get recommended posts based on current post
    getRecommendedPosts: builder.query<Array<{
      id: string;
      title: string;
      desc: string;
      category: string;
      img: string;
    }>, string>({
      query: (postId) => ({
        url: "/web/api/v1/adds/GetRecommendationNews",
        params: { postId },
      }),
    }),
    
    // Get ticket by ID (public)
    getTicketById: builder.query<any, string>({
      query: (ticketId) => ({
        url: "/web/api/v1/GetTicketById",
        params: { ticketId },
      }),
    }),
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
    // Public courts endpoint - using different tag type to avoid conflicts with venue-owner courts
    // Get public courts
    getPublicCourts: builder.query<Court[], { venueId?: string }>({
      query: (params) => ({
        url: "/web/api/v1/GetCourt",
        params,
      }),
      providesTags: (result) =>
        result
          ? [...result.map((court) => ({ type: 'PublicCourts' as const, id: court.courtID })), { type: 'PublicCourts', id: 'LIST' }]
          : [{ type: 'PublicCourts', id: 'LIST' }],
    }),
    
    // Get single court by ID (public)
    getPublicCourtById: builder.query<Court, string>({
      query: (courtId) => ({
        url: "/web/api/v1/GetCourtById",
        params: { courtId },
      }),
      providesTags: (result, error, id) => [{ type: 'PublicCourts', id }],
    }),
    getCourtById: builder.query<any, string>({
      query: (courtId) => ({
        url: "/web/api/v1/GetCourtById",
        params: { courtId },
      }),
      providesTags: (result, error, id) => [{ type: "Courts", id }],
    }),
    
    // Create a new booking with multiple tickets
    createBooking: builder.mutation<{ 
      success: boolean; 
      bookingId?: string;
      bookId?: string;
      paymentStatus?: string;
      price?: number;
      amount?: number;
      message?: string;
      error?: string;
      data?: any;
    }, { 
      ticketIds: string[]; 
      paymentTypeId: string; 
      userId: string;
      totalPrice: number;
      courtId: string;
    }>({
      query: (body) => {
        if (!body.userId) {
          throw new Error('User ID is required for booking');
        }
        if (!body.paymentTypeId) {
          throw new Error('Payment type is required for booking');
        }
        if (body.totalPrice === undefined || body.totalPrice === null) {
          throw new Error('Total price is required for booking');
        }
        if (!body.ticketIds?.length) {
          throw new Error('At least one ticket ID is required');
        }
        
        return {
          url: "/web/api/v1/user/CreateTicket",
          method: "POST",
          body: {
            ticketId: body.ticketIds, // Array of ticket IDs
            paymentTypeId: body.paymentTypeId,
            userId: body.userId,
            totalPrice: body.totalPrice,
            courtId: body.courtId
          },
        };
      },
      transformResponse: (response: any) => {
        // Handle different response formats
        if (!response) {
          return { success: false, error: 'No response from server' };
        }
        
        // If response already has success status, return as is
        if (typeof response.success !== 'undefined' || response.bookingId || response.bookId) {
          return response;
        }
        
        // Handle case where response is wrapped in data property
        if (response.data) {
          return { ...response.data, success: response.data.success || false };
        }
        
        // If we get here, the response format is unexpected
        return { 
          success: false, 
          error: 'Unexpected response format',
          data: response // Include original response for debugging
        };
      },
      invalidatesTags: (result, error, { ticketIds }) => [
        ...ticketIds.map(id => ({ type: 'TimeSlots' as const, id })),
        { type: 'TimeSlots', id: 'LIST' }
      ],
    }),
  }),
});

// Export the API slice and its hooks
// Export hooks with their original names
export const {
  useGetPaymentTypesQuery,
  useGetCountDataQuery,
  useGetEventsQuery,
  useGetEventByIdQuery,
  useGetTicketsQuery,
  useGetTicketByIdQuery,
  useGetPublicPostsQuery,
  useGetPublicPostByIdQuery,
  useGetPublicReelsQuery,
  useGetPublicReelByIdQuery,
  useGetVenuesQuery,
  useGetVenueByIdQuery,
  useGetPublicCourtsQuery,
  useGetPublicCourtByIdQuery,
  useGetRecommendedPostsQuery,
  useCreateBookingMutation,
} = publicApi;

// For backward compatibility, export aliases for the courts queries
export const useGetCourtsQuery = useGetPublicCourtsQuery;
export const useGetCourtByIdQuery = useGetPublicCourtByIdQuery;

export { publicApi };
export default publicApi;

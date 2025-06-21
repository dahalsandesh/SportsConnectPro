import { baseApi } from "./baseApi";
import type { Post, Reel, Court, Event, TimeSlot } from '@/types/api';

// Create the public API slice
const publicApi = baseApi.injectEndpoints({
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
          url: "/web/api/v1/venue/GetTicket",
          params: Object.fromEntries(params),
        };
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'TimeSlots' as const, id })), { type: 'TimeSlots', id: 'LIST' }]
          : [{ type: 'TimeSlots', id: 'LIST' }],
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
    getCourts: builder.query<any[], void>({
      query: () => "/web/api/v1/GetCourt",
      providesTags: (result) =>
        result
          ? [...result.map((court: any) => ({ type: 'Courts' as const, id: court.courtID })), { type: 'Courts', id: 'LIST' }]
          : [{ type: 'Courts', id: 'LIST' }],
    }),
    getCourtById: builder.query<any, string>({
      query: (courtId) => ({
        url: "/web/api/v1/GetCourtById",
        params: { courtId },
      }),
      providesTags: (result, error, id) => [{ type: "Courts", id }],
    }),
    
    // Create a new booking
    createBooking: builder.mutation<{ success: boolean; bookingId: string }, { timeSlotId: string }>({
      query: (body) => ({
        url: "/web/api/v1/CreateBooking",
        method: "POST",
        body: {
          timeSlotIds: [body.timeSlotId] // Match backend expected format
        },
      }),
      invalidatesTags: (result, error, { timeSlotId }) => [
        { type: 'TimeSlots', id: timeSlotId },
        { type: 'TimeSlots', id: 'LIST' }
      ],
    }),
  }),
});

// Export the API slice and its hooks
export const {
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
  useGetCourtsQuery,
  useGetCourtByIdQuery,
  useCreateBookingMutation,
} = publicApi;

export { publicApi };
export default publicApi;

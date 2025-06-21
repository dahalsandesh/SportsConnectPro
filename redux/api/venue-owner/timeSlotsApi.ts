import { baseApi } from "../baseApi"
import type { 
  ApiResponse, 
  VenueTicket, 
  CreateTicketRequest, 
  UpdateTicketRequest,
  TimeSlot as ITimeSlot
} from "@/types/api"

export const timeSlotsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get tickets by court and date
    getTickets: builder.query<VenueTicket[], { courtId: string; date: string }>({
      query: ({ courtId, date }) => ({
        url: "/web/api/v1/venue/GetTicket",
        method: "GET",
        params: { courtId, date },
      }),
      providesTags: (result, error, { courtId, date }) => {
        // Always return at least the list tag
        const tags = [{ type: 'Tickets' as const, id: 'LIST' }];
        
        // If there's an error or no result, just return the list tag
        if (error || !result) {
          return tags;
        }
        
        // Ensure result is an array before mapping
        const resultArray = Array.isArray(result) ? result : [result];
        
        // Add individual ticket tags
        const ticketTags = resultArray
          .filter((ticket): ticket is VenueTicket => Boolean(ticket))
          .map(ticket => ({
            type: 'Tickets' as const,
            id: ticket.id || `${courtId}-${date}-${ticket.startTime}`
          }));
          
        return [...ticketTags, ...tags];
      },
    }),

    // Get ticket by ID
    getTicketById: builder.query<VenueTicket, { ticketId: string }>({
      query: ({ ticketId }) => ({
        url: "/web/api/v1/venue/GetTicketById",
        method: "GET",
        params: { ticketId },
      }),
      providesTags: (result, error, { ticketId }) => [
        { type: 'Tickets' as const, id: ticketId },
        { type: 'Tickets' as const, id: 'LIST' },
      ],
    }),

    // Create tickets
    createTickets: builder.mutation<ApiResponse<null> | VenueTicket[], {
      courtId: string;
      date: string;
      ticketList: Array<{
        startTime: string;
        endTime: string;
        specialPrice: number | null;
      }>;
    }>({
      query: (data) => {
        console.log('Sending createTickets request:', JSON.stringify(data, null, 2));
        return {
          url: "/web/api/v1/venue/CreateTicket",
          method: "POST",
          body: data,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
      transformErrorResponse: (response, meta, arg) => {
        console.error('Create tickets error:', {
          status: response.status,
          data: response.data,
          meta,
          arg
        });
        return response;
      },
      invalidatesTags: ['Tickets'],
    }),

    // Update ticket status
    updateTicketStatus: builder.mutation<ApiResponse<null>, {
      ticketId: string;
      isActive: boolean;
    }>({
      query: ({ ticketId, isActive }) => ({
        url: "/web/api/v1/venue/UpdateTicketStatus",
        method: "POST",
        body: { ticketId, isActive },
      }),
      invalidatesTags: (result, error, { ticketId }) => [
        { type: 'Tickets', id: ticketId },
        { type: 'Tickets', id: 'LIST' },
      ],
    }),

    // Get available time slots for a court
    getAvailableTimeSlots: builder.query<ITimeSlot[], { 
      courtId: string; 
      date: string;
      duration?: number; // in minutes
    }>({
      query: ({ courtId, date, duration }) => ({
        url: "/web/api/v1/venue/GetAvailableTimeSlots",
        method: "GET",
        params: { 
          courtId, 
          date, 
          duration: duration?.toString() // Ensure duration is a string
        },
      }),
      // Add proper tagging for cache invalidation
      providesTags: (result, error, { courtId, date }) => [
        { type: 'TimeSlots' as const, id: `${courtId}-${date}` },
        { type: 'TimeSlots' as const, id: 'LIST' }
      ],
    }),
  }),
})

// Export hooks for usage in components
export const {
  useGetTicketsQuery,
  useGetTicketByIdQuery,
  useCreateTicketsMutation,
  useUpdateTicketStatusMutation,
  useGetAvailableTimeSlotsQuery,
  useLazyGetAvailableTimeSlotsQuery, // Add lazy query hook
} = timeSlotsApi;

// Export endpoints for use in other parts of the application
export const timeSlotsEndpoints = timeSlotsApi.endpoints;

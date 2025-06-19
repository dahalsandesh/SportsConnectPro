import { baseApi } from "../baseApi"
import type { 
  ApiResponse, 
  VenueTicket, 
  CreateTicketRequest, 
  UpdateTicketRequest
} from "@/types/api"

// Define the tag type for this API
type TimeSlotTag = { type: 'TimeSlots', id: string | 'LIST' }

// Helper type for tag arrays
type TagArray<T> = Array<T | { type: T; id: string | number }>

export const timeSlotsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get time slots by date for a specific court
    getTimeSlots: builder.query<VenueTicket[], { courtId: string; date: string }>({
      query: ({ courtId, date }) => ({
        url: "/web/api/v1/venue/GetTicket",
        params: { courtId, date },
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'TimeSlots' as const, id })), { type: 'TimeSlots', id: 'LIST' }]
          : [{ type: 'TimeSlots', id: 'LIST' }],
    }),

    // Get time slot by ID
    getTimeSlotById: builder.query<VenueTicket, { ticketId: string }>({
      query: ({ ticketId }) => ({
        url: "/web/api/v1/venue/GetTicketById",
        params: { ticketId },
      }),
      providesTags: (result, error, { ticketId }) => [{ type: 'TimeSlots', id: ticketId }],
    }),

    // Create time slots for a specific date
    createTimeSlots: builder.mutation<ApiResponse<null>, CreateTicketRequest>({
      query: (data) => ({
        url: "/web/api/v1/venue/CreateTicket",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: 'TimeSlots', id: 'LIST' }],
    }),

    // Update a time slot
    updateTimeSlot: builder.mutation<ApiResponse<null>, UpdateTicketRequest>({
      query: (data) => ({
        url: "/web/api/v1/venue/UpdateTicket",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { ticketId }) => [
        { type: 'TimeSlots', id: ticketId },
        { type: 'TimeSlots', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useGetTimeSlotsQuery,
  useGetTimeSlotByIdQuery,
  useCreateTimeSlotsMutation,
  useUpdateTimeSlotMutation,
} = timeSlotsApi

// Export endpoints for use in other parts of the application
export const timeSlotsEndpoints = timeSlotsApi.endpoints

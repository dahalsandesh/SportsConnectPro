import { baseApi } from "../baseApi"
import type { ApiResponse, VenueTicket, TimeSlot as ITimeSlot } from "@/types/api"

export const timeSlotsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get time slots for a court and date
    getTimeSlots: builder.query<
      ITimeSlot[],
      {
        courtId: string
        date: string
        userId: string
      }
    >({
      query: ({ courtId, date, userId }) => ({
        url: "/web/api/v1/venue/GetTimeSlots",
        method: "GET",
        params: { courtId, date, userId },
      }),
      providesTags: (result, error, { courtId, date }) => [
        { type: "TimeSlots" as const, id: `${courtId}-${date}` },
        { type: "TimeSlots" as const, id: "LIST" },
      ],
    }),

    // Get tickets by court and date
    getTickets: builder.query<VenueTicket[], { courtId: string; date: string; userId: string }>({
      query: ({ courtId, date, userId }) => ({
        url: "/web/api/v1/venue/GetTicket",
        method: "GET",
        params: { courtId, date, userId },
      }),
      providesTags: (result, error, { courtId, date }) => {
        const tags = [{ type: "Tickets" as const, id: "LIST" }]

        if (error || !result) {
          return tags
        }

        const resultArray = Array.isArray(result) ? result : [result]

        const ticketTags = resultArray
          .filter((ticket): ticket is VenueTicket => Boolean(ticket))
          .map((ticket) => ({
            type: "Tickets" as const,
            id: ticket.id || `${courtId}-${date}-${ticket.startTime}`,
          }))

        return [...ticketTags, ...tags]
      },
    }),

    // Get ticket by ID
    getTicketById: builder.query<VenueTicket, { ticketId: string; userId: string }>({
      query: ({ ticketId, userId }) => ({
        url: "/web/api/v1/venue/GetTicketById",
        method: "GET",
        params: { ticketId, userId },
      }),
      providesTags: (result, error, { ticketId }) => [
        { type: "Tickets" as const, id: ticketId },
        { type: "Tickets" as const, id: "LIST" },
      ],
    }),

    // Create tickets
    createTickets: builder.mutation<
      ApiResponse<null> | VenueTicket[],
      {
        courtId: string
        date: string
        userId: string
        ticketList: Array<{
          startTime: string
          endTime: string
          specialPrice: number | null
        }>
      }
    >({
      query: (data) => {
        console.log("Sending createTickets request:", JSON.stringify(data, null, 2))
        return {
          url: "/web/api/v1/venue/CreateTicket",
          method: "POST",
          body: data,
          headers: {
            "Content-Type": "application/json",
          },
        }
      },
      transformErrorResponse: (response, meta, arg) => {
        console.error("Create tickets error:", {
          status: response.status,
          data: response.data,
          meta,
          arg,
        })
        return response
      },
      invalidatesTags: ["Tickets"],
    }),

    // Update ticket status
    updateTicketStatus: builder.mutation<
      ApiResponse<null>,
      {
        ticketId: string
        isActive: boolean
        userId: string
      }
    >({
      query: ({ ticketId, isActive, userId }) => ({
        url: "/web/api/v1/venue/UpdateTicketStatus",
        method: "POST",
        body: { ticketId, isActive, userId },
      }),
      invalidatesTags: (result, error, { ticketId }) => [
        { type: "Tickets", id: ticketId },
        { type: "Tickets", id: "LIST" },
      ],
    }),

    // Update time slot - this was missing
    updateTimeSlot: builder.mutation<
      ApiResponse<null>,
      {
        timeSlotId: string
        startTime: string
        endTime: string
        isActive: boolean
        userId: string
      }
    >({
      query: ({ timeSlotId, startTime, endTime, isActive, userId }) => ({
        url: "/web/api/v1/venue/UpdateTimeSlot",
        method: "POST",
        body: { timeSlotId, startTime, endTime, isActive, userId },
      }),
      invalidatesTags: (result, error, { timeSlotId }) => [
        { type: "TimeSlots", id: timeSlotId },
        { type: "TimeSlots", id: "LIST" },
      ],
    }),

    // Get available time slots for a court
    getAvailableTimeSlots: builder.query<
      ITimeSlot[],
      {
        courtId: string
        date: string
        userId: string
        duration?: number
      }
    >({
      query: ({ courtId, date, userId, duration }) => ({
        url: "/web/api/v1/venue/GetAvailableTimeSlots",
        method: "GET",
        params: {
          courtId,
          date,
          userId,
          duration: duration?.toString(),
        },
      }),
      providesTags: (result, error, { courtId, date }) => [
        { type: "TimeSlots" as const, id: `${courtId}-${date}` },
        { type: "TimeSlots" as const, id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetTimeSlotsQuery,
  useGetTicketsQuery,
  useGetTicketByIdQuery,
  useCreateTicketsMutation,
  useUpdateTicketStatusMutation,
  useUpdateTimeSlotMutation, // This was missing
  useGetAvailableTimeSlotsQuery,
  useLazyGetAvailableTimeSlotsQuery,
} = timeSlotsApi

export const timeSlotsEndpoints = timeSlotsApi.endpoints

import { baseApi } from "../baseApi";
import type { ApiResponse, VenueTicket, CreateTicketRequest, UpdateTicketRequest } from '@/types/api';

export const ticketApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTicket: builder.mutation<ApiResponse<null>, CreateTicketRequest>({
      query: (data) => ({
        url: "/web/api/v1/venue/CreateTicket",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{type: "TimeSlots", id: 'LIST'}],
    }),
    getTicketsByDate: builder.query<VenueTicket[], { courtId: string; date: string }>({
      query: ({ courtId, date }) => ({
        url: "/web/api/v1/venue/GetTicket",
        params: { courtId, date },
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'TimeSlots' as const, id })), { type: 'TimeSlots', id: 'LIST' }]
          : [{ type: 'TimeSlots', id: 'LIST' }],
    }),
    getTicketById: builder.query<VenueTicket, { ticketId: string }>({
      query: ({ ticketId }) => ({
        url: "/web/api/v1/venue/GetTicketById",
        params: { ticketId },
      }),
      providesTags: (result, error, { ticketId }) => [{ type: 'TimeSlots', id: ticketId }],
    }),
    updateTicket: builder.mutation<ApiResponse<null>, UpdateTicketRequest>({
      query: (data) => ({
        url: "/web/api/v1/venue/UpdateTicket",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { ticketId }) => [{ type: 'TimeSlots', id: ticketId }],
    }),
  }),
});

export const {
    useCreateTicketMutation,
    useGetTicketsByDateQuery,
    useGetTicketByIdQuery,
    useUpdateTicketMutation,
} = ticketApi;

import { baseApi } from "../baseApi";
import type { ApiResponse, SportsEvent } from '@/types/api';

export const eventApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSportsEvent: builder.mutation<ApiResponse<null>, FormData>({
      query: (formData) => ({
        url: "/web/api/v1/venue/CreateEvent",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{type: "SportsEvents", id: 'LIST'}],
    }),
    getSportsEvents: builder.query<SportsEvent[], { courtId: string }>({
      query: ({ courtId }) => ({
        url: "/web/api/v1/venue/GetEvent",
        params: { courtId },
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ eventId }) => ({ type: 'SportsEvents' as const, id: eventId })), { type: 'SportsEvents', id: 'LIST' }]
          : [{ type: 'SportsEvents', id: 'LIST' }],
    }),
    getSportsEventById: builder.query<SportsEvent, { eventId: string }>({
      query: ({ eventId }) => ({
        url: "/web/api/v1/venue/GetEventById",
        params: { eventId },
      }),
      providesTags: (result, error, { eventId }) => [{ type: 'SportsEvents', id: eventId }],
    }),
    updateSportsEvent: builder.mutation<ApiResponse<null>, FormData>({
      query: (formData) => ({
        url: "/web/api/v1/venue/UpdateEvent",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, formData) => [{ type: 'SportsEvents', id: formData.get('eventId') as string }],
    }),
    deleteSportsEvent: builder.mutation<ApiResponse<null>, { eventId: string }>({
      query: ({ eventId }) => ({
        url: "/web/api/v1/venue/DelEvent",
        method: "POST",
        body: { eventId },
      }),
      invalidatesTags: (result, error, { eventId }) => [{ type: 'SportsEvents', id: eventId }, {type: 'SportsEvents', id: 'LIST'}],
    }),
  }),
});

export const {
    useCreateSportsEventMutation,
    useGetSportsEventsQuery,
    useGetSportsEventByIdQuery,
    useUpdateSportsEventMutation,
    useDeleteSportsEventMutation,
} = eventApi;

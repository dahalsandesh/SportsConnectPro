import { baseApi } from "../baseApi";
import type { ApiResponse, SportsEvent } from '@/types/api';

export const sportsEventsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSportsEvents: builder.query<SportsEvent[], { venueId: string }>({
      query: ({ venueId }) => ({
        url: `/web/api/v1/venue/GetSportsEvents`,
        params: { venueId },
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ eventId }) => ({ type: 'SportsEvents' as const, id: eventId })), { type: 'SportsEvents', id: 'LIST' }]
          : [{ type: 'SportsEvents', id: 'LIST' }],
    }),
    createSportsEvent: builder.mutation<ApiResponse<null>, FormData>({
      query: (formData) => ({
        url: "/web/api/v1/venue/CreateSportsEvent",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{type: "SportsEvents", id: 'LIST'}],
    }),
    updateSportsEvent: builder.mutation<ApiResponse<null>, FormData>({
        query: (formData) => ({
          url: "/web/api/v1/venue/UpdateSportsEvent",
          method: "POST",
          body: formData,
        }),
        invalidatesTags: (result, error, formData) => [{ type: 'SportsEvents', id: formData.get('eventId') as string }],
      }),
    deleteSportsEvent: builder.mutation<ApiResponse<null>, { eventId: string }>({
        query: ({ eventId }) => ({
          url: "/web/api/v1/venue/DeleteSportsEvent",
          method: "POST",
          body: { eventId },
        }),
        invalidatesTags: (result, error, { eventId }) => [{ type: 'SportsEvents', id: eventId }, {type: 'SportsEvents', id: 'LIST'}],
      }),
  }),
});

export const {
    useGetSportsEventsQuery,
    useCreateSportsEventMutation,
    useUpdateSportsEventMutation,
    useDeleteSportsEventMutation,
} = sportsEventsApi;

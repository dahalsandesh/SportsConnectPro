import { baseApi } from "../baseApi";
import type { ApiResponse, SportsEvent } from "@/types/api";

export const adminEventsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEvents: builder.query<SportsEvent[], void>({
      query: () => "/web/api/v1/adminapp/GetAllEvents", // Adjust endpoint as needed
      providesTags: ["Events"],
    }),
    getEventById: builder.query<SportsEvent, string>({
      query: (eventId) => ({
        url: "/web/api/v1/adminapp/GetEventById",
        params: { eventId },
      }),
      providesTags: (result, error, id) => [{ type: "Events", id }],
    }),
    createEvent: builder.mutation<ApiResponse<null>, FormData>({
      query: (formData) => ({
        url: "/web/api/v1/adminapp/CreateEvent",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Events"],
    }),
    updateEvent: builder.mutation<ApiResponse<null>, FormData>({
      query: (formData) => ({
        url: "/web/api/v1/adminapp/UpdateEvent",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Events"],
    }),
    deleteEvent: builder.mutation<ApiResponse<null>, { eventId: string }>({
      query: ({ eventId }) => ({
        url: "/web/api/v1/adminapp/DelEvent",
        method: "POST",
        body: { eventId },
      }),
      invalidatesTags: ["Events"],
    }),
  }),
});

export const {
  useGetAllEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = adminEventsApi; 
import { baseApi } from "../baseApi"
import type { 
  ApiResponse, 
  TimeSlot, 
  CreateTimeSlotRequest, 
  UpdateTimeSlotRequest, 
  DeleteTimeSlotRequest,
  TimeSlotQueryParams
} from "@/types/api"

// Define the tag type for this API
type TimeSlotTag = { type: 'TimeSlots', id: string | 'LIST' }

// Helper type for tag arrays
type TagArray<T> = Array<T | { type: T; id: string | number }>

export const timeSlotsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get time slots with filters
    getTimeSlots: builder.query<TimeSlot[], TimeSlotQueryParams | void>({
      query: (params) => {
        const queryParams = params || {};
        return {
          url: "/web/api/v1/time-slots",
          params: queryParams as Record<string, any>,
        };
      },
      providesTags: (result = []): TagArray<'TimeSlots'> => [
        { type: 'TimeSlots', id: 'LIST' },
        ...result.map<TimeSlotTag>(({ id }) => ({ type: 'TimeSlots', id: String(id) })),
      ],
    }),

    // Get time slot by ID
    getTimeSlotById: builder.query<TimeSlot, string>({
      query: (timeSlotId) => ({
        url: `/web/api/v1/time-slots/${timeSlotId}`,
      }),
      providesTags: (result, error, id): TagArray<'TimeSlots'> => [
        { type: 'TimeSlots', id: String(id) }
      ],
    }),

    // Create a new time slot
    createTimeSlot: builder.mutation<ApiResponse<TimeSlot>, CreateTimeSlotRequest>({
      query: (data) => ({
        url: "/web/api/v1/time-slots",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (): TagArray<'TimeSlots'> => [
        { type: 'TimeSlots', id: 'LIST' }
      ],
    }),

    // Update a time slot
    updateTimeSlot: builder.mutation<ApiResponse<TimeSlot>, UpdateTimeSlotRequest & { id: string }>({
      query: ({ id, ...data }) => ({
        url: `/web/api/v1/time-slots/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }): TagArray<'TimeSlots'> => [
        { type: 'TimeSlots', id: String(id) },
        { type: 'TimeSlots', id: 'LIST' },
      ],
    }),

    // Delete a time slot
    deleteTimeSlot: builder.mutation<ApiResponse<null>, DeleteTimeSlotRequest>({
      query: ({ id }) => ({
        url: `/web/api/v1/time-slots/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }): TagArray<'TimeSlots'> => [
        { type: 'TimeSlots', id: String(id) },
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
  useCreateTimeSlotMutation,
  useUpdateTimeSlotMutation,
  useDeleteTimeSlotMutation,
} = timeSlotsApi

// Export endpoints for use in other parts of the application
export const timeSlotsEndpoints = timeSlotsApi.endpoints

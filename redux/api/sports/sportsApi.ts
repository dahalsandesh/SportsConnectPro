import { baseApi } from "../baseApi"
import type { 
  ApiResponse, 
  Sport, 
  CreateSportRequest, 
  UpdateSportRequest, 
  DeleteSportRequest 
} from "@/types/api"

// Define the tag type for this API
type SportTag = { type: 'Sports', id: string | 'LIST' }

// Helper type for tag arrays
type TagArray<T> = Array<T | { type: T; id: string | number }>

export const sportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all sports
    getSports: builder.query<Sport[], void>({
      query: () => "/web/api/v1/sports",
      providesTags: (result): TagArray<'Sports'> => 
        result
          ? [
              ...result.map<SportTag>(({ id }) => ({ type: 'Sports', id: String(id) }))
            ]
          : [{ type: 'Sports', id: 'LIST' }],
    }),

    // Get sport by ID
    getSportById: builder.query<Sport, string>({
      query: (sportId) => ({
        url: `/web/api/v1/sports/${sportId}`,
      }),
      providesTags: (result, error, id): TagArray<'Sports'> => [{ type: 'Sports', id: String(id) }],
    }),

    // Create a new sport
    createSport: builder.mutation<ApiResponse<Sport>, CreateSportRequest>({
      query: (data) => ({
        url: "/web/api/v1/sports",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (): TagArray<'Sports'> => [{ type: 'Sports', id: 'LIST' }],
    }),

    // Update a sport
    updateSport: builder.mutation<ApiResponse<Sport>, UpdateSportRequest>({
      query: ({ id, ...data }) => ({
        url: `/web/api/v1/sports/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }): TagArray<'Sports'> => [
        { type: 'Sports', id: String(id) },
        { type: 'Sports', id: 'LIST' },
      ],
    }),

    // Delete a sport
    deleteSport: builder.mutation<ApiResponse<null>, DeleteSportRequest>({
      query: ({ id }) => ({
        url: `/web/api/v1/sports/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }): TagArray<'Sports'> => [
        { type: 'Sports', id: String(id) },
        { type: 'Sports', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useGetSportsQuery,
  useGetSportByIdQuery,
  useCreateSportMutation,
  useUpdateSportMutation,
  useDeleteSportMutation,
} = sportsApi

// Export endpoints for use in other parts of the application
export const sportsEndpoints = sportsApi.endpoints

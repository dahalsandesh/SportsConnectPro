import { baseApi } from "../baseApi"
import type { 
  ApiResponse, 
  Review, 
  CreateReviewRequest, 
  UpdateReviewRequest, 
  DeleteReviewRequest,
  ReviewQueryParams
} from "@/types/api"

// Define the tag type for this API
type ReviewTag = { type: 'Reviews', id: string | 'LIST' }

// Helper type for tag arrays
type TagArray<T> = Array<T | { type: T; id: string | number }>

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get reviews with filters
    getReviews: builder.query<Review[], ReviewQueryParams | void>({
      query: (params) => {
        const queryParams = params || {};
        return {
          url: "/web/api/v1/reviews",
          params: queryParams as Record<string, any>,
        };
      },
      providesTags: (result = []): TagArray<'Reviews'> => [
        { type: 'Reviews', id: 'LIST' },
        ...(result?.map<ReviewTag>(({ id }) => ({ type: 'Reviews', id: String(id) })) || []),
      ],
    }),

    // Get review by ID
    getReviewById: builder.query<Review, string>({
      query: (id) => ({
        url: `/web/api/v1/reviews/${id}`,
      }),
      providesTags: (result, error, id): TagArray<'Reviews'> => [
        { type: 'Reviews', id: String(id) }
      ],
    }),

    // Create a new review
    createReview: builder.mutation<ApiResponse<Review>, CreateReviewRequest>({
      query: (data) => ({
        url: "/web/api/v1/reviews",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (): TagArray<'Reviews'> => [
        { type: 'Reviews', id: 'LIST' }
      ],
    }),

    // Update a review
    updateReview: builder.mutation<ApiResponse<Review>, UpdateReviewRequest & { id: string }>({
      query: ({ id, ...data }) => ({
        url: `/web/api/v1/reviews/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }): TagArray<'Reviews'> => [
        { type: 'Reviews', id: String(id) },
        { type: 'Reviews', id: 'LIST' },
      ],
    }),

    // Delete a review
    deleteReview: builder.mutation<ApiResponse<null>, DeleteReviewRequest>({
      query: ({ id }) => ({
        url: `/web/api/v1/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }): TagArray<'Reviews'> => [
        { type: 'Reviews', id: String(id) },
        { type: 'Reviews', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useGetReviewsQuery,
  useGetReviewByIdQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewsApi

// Export endpoints for use in other parts of the application
export const reviewsEndpoints = reviewsApi.endpoints

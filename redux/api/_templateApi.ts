import { baseApi } from "./baseApi"
import type { ApiResponse } from "@/types/api"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"

// Helper function to handle API responses and errors
const handleApiResponse = <T,>(response: any, defaultValue: T): T => {
  if (!response) return defaultValue;
  if (response.error) {
    console.error('API Error:', response.error);
    return defaultValue;
  }
  return response.data ?? defaultValue;
};

// Type for transformed query response
type QueryResponse<T, Default = T | null> = {
  data: T | Default;
  error?: FetchBaseQueryError;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
};

// Define the tag type for this API
type EntityTag = { type: 'Bookings', id: string | number | 'LIST' };

// Helper type for tag arrays
type TagArray<T> = Array<T | { type: T; id: string | number }>;

// Define request/response types for the entity
interface Entity {
  id: string | number;
  [key: string]: any;
}

interface CreateEntityRequest {
  [key: string]: any;
}

interface UpdateEntityRequest {
  id: string | number;
  [key: string]: any;
}

export const entityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEntities: builder.query<Entity[], void>({
      query: () => "/api/endpoint",
      transformResponse: (response: ApiResponse<Entity[]> | null) => 
        handleApiResponse<Entity[]>(response, []),
      providesTags: (result = []): TagArray<'Bookings'> => [
        { type: 'Bookings', id: 'LIST' },
        ...result.map<EntityTag>(({ id }) => ({
          type: 'Bookings',
          id,
        })),
      ],
    }),

    getEntityById: builder.query<Entity | null, string | number>({
      query: (id) => ({
        url: `/api/endpoint/${id}`,
        params: { id },
      }),
      transformResponse: (response: ApiResponse<Entity> | null) => 
        handleApiResponse<Entity | null>(response, null),
      providesTags: (result, error, id): TagArray<'Bookings'> => 
        result ? [{ type: 'Bookings', id }] : [],
    }),

    createEntity: builder.mutation<ApiResponse<Entity>, CreateEntityRequest>({
      query: (data) => ({
        url: "/api/endpoint",
        method: "POST",
        body: data,
      }),
      transformErrorResponse: (response) => {
        console.error('Create entity error:', response);
        return response;
      },
      invalidatesTags: (): TagArray<'Bookings'> => [
        { type: 'Bookings', id: 'LIST' },
      ],
    }),

    updateEntity: builder.mutation<ApiResponse<Entity>, UpdateEntityRequest>({
      query: ({ id, ...data }) => ({
        url: `/api/endpoint/${id}`,
        method: "PUT",
        body: data,
      }),
      transformErrorResponse: (response) => {
        console.error('Update entity error:', response);
        return response;
      },
      invalidatesTags: (result, error, { id }): TagArray<'Bookings'> => [
        { type: 'Bookings', id },
        { type: 'Bookings', id: 'LIST' },
      ],
    }),

    deleteEntity: builder.mutation<ApiResponse<null>, string | number>({
      query: (id) => ({
        url: `/api/endpoint/${id}`,
        method: "DELETE",
      }),
      transformErrorResponse: (response) => {
        console.error('Delete entity error:', response);
        return response;
      },
      invalidatesTags: (result, error, id): TagArray<'Bookings'> => [
        { type: 'Bookings', id },
        { type: 'Bookings', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useGetEntitiesQuery,
  useGetEntityByIdQuery,
  useCreateEntityMutation,
  useUpdateEntityMutation,
  useDeleteEntityMutation,
} = entityApi

// Export types for components
export type {
  QueryResponse,
  FetchBaseQueryError as ApiError,
};

// Export the API instance for potential direct usage
export default entityApi;

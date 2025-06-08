import { baseApi } from "./baseApi"
import type { ApiResponse, City, CreateCityRequest, DeleteCityRequest } from "@/types/api"
import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query"

// Helper function to handle API responses and errors
const handleApiResponse = <T,>(response: any): T | [] => {
  if (!response) return [] as unknown as T;
  if (response.error) {
    console.error('API Error:', response.error);
    return [] as unknown as T;
  }
  return response.data || [];
};

// Type for transformed query response
type QueryResponse<T> = {
  data: T | [];
  error?: FetchBaseQueryError;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
};

export const cityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCities: builder.query<City[], void>({
      query: () => "/web/api/v1/adminapp/GetAllCity",
      transformResponse: (response: ApiResponse<City[]> | null) => 
        handleApiResponse<City[]>(response) || [],
      providesTags: ["Cities"],
    }),

    getCityById: builder.query<City | null, string>({
      query: (cityId) => ({
        url: "/web/api/v1/adminapp/GetCityById",
        params: { cityId },
      }),
      transformResponse: (response: ApiResponse<City> | null) => 
        response?.data || null,
      providesTags: (result, error, id) => 
        result ? [{ type: "Cities" as const, id }] : [],
    }),

    createCity: builder.mutation<ApiResponse<null>, CreateCityRequest>({
      query: (data) => ({
        url: "/web/api/v1/adminapp/CreateCity",
        method: "POST",
        body: data,
      }),
      transformErrorResponse: (response) => {
        console.error('Create city error:', response);
        return response;
      },
      invalidatesTags: ["Cities"],
    }),

    deleteCity: builder.mutation<ApiResponse<null>, DeleteCityRequest>({
      query: (data) => ({
        url: "/web/api/v1/adminapp/DelCity",
        method: "POST",
        body: data,
      }),
      transformErrorResponse: (response) => {
        console.error('Delete city error:', response);
        return response;
      },
      invalidatesTags: ["Cities"],
    }),
  }),
})

// Export hooks with proper types
export const {
  useGetCitiesQuery,
  useGetCityByIdQuery,
  useCreateCityMutation,
  useDeleteCityMutation,
} = cityApi;

// Export types for components
export type {
  QueryResponse,
  FetchBaseQueryError as ApiError,
};

// Export the API instance for potential direct usage
export default cityApi;

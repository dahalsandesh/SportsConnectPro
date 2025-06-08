import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../../store/reducers"
import { getBaseUrl } from "../baseApi"

// Define interfaces for the API
export interface City {
  cityId: string
  cityName: string
}

export interface CreateCityRequest {
  cityName: string
}

export interface UpdateCityRequest extends CreateCityRequest {
  cityId: string
}

// Create the API instance
const api = createApi({
  reducerPath: 'citiesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/web/api/v1/adminapp`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set('Authorization', `token ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Cities'],
  endpoints: (builder) => ({
    // Get all cities
    getAllCities: builder.query<City[], void>({
      query: () => "/GetAllCity",
      providesTags: (result = []) => [
        ...(result?.map(({ cityId }) => ({ type: 'Cities' as const, id: cityId })) || []),
        { type: 'Cities', id: 'LIST' },
      ],
    }),

    // Get city by ID
    getCityById: builder.query<City, string>({
      query: (id) => ({
        url: "/GetCityById",
        params: { cityId: id },
      }),
      providesTags: (result, error, id) => [{ type: 'Cities' as const, id }],
    }),

    // Create a new city
    createCity: builder.mutation<City, CreateCityRequest>({
      query: (city) => ({
        url: "/CreateCity",
        method: "POST",
        body: city,
      }),
      invalidatesTags: [{ type: 'Cities', id: 'LIST' }],
    }),

    // Update a city
    updateCity: builder.mutation<City, UpdateCityRequest>({
      query: ({ cityId, ...updates }) => ({
        url: "/UpdateCity",
        method: "PUT",
        body: updates,
        params: { cityId },
      }),
      invalidatesTags: (result, error, { cityId }) => [
        { type: 'Cities' as const, id: cityId },
        { type: 'Cities' as const, id: 'LIST' },
      ],
    }),

    // Delete a city
    deleteCity: builder.mutation<void, string>({
      query: (id) => ({
        url: "/DelCity",
        method: "DELETE",
        body: { cityId: id },
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Cities' as const, id },
        { type: 'Cities' as const, id: 'LIST' },
      ],
    }),
  }),
})

// Export hooks for usage in functional components
export const {
  useGetAllCitiesQuery,
  useGetCityByIdQuery,
  useCreateCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
} = api

export const citiesApi = api

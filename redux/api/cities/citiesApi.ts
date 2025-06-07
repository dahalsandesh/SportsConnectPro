import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../../store/reducers"
import { getBaseUrl } from "../baseApi"

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

export const citiesApi = createApi({
  reducerPath: "citiesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/web/api/v1/admin`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set("Authorization", `token ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["Cities"],
  endpoints: (builder) => ({
    // Get all cities
    getAllCities: builder.query<City[], void>({
      query: () => "/GetAllCity",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ cityId }) => ({ type: 'Cities' as const, cityId })),
              { type: 'Cities', id: 'LIST' },
            ]
          : [{ type: 'Cities', id: 'LIST' }],
    }),

    // Get city by ID
    getCityById: builder.query<City, string>({
      query: (id) => ({
        url: "/GetCityById",
        params: { cityId: id },
      }),
      providesTags: (result, error, id) => [{ type: 'Cities', id }],
    }),

    // Create a new city
    createCity: builder.mutation<{ message: string }, CreateCityRequest>({
      query: (city) => ({
        url: "/CreateCity",
        method: 'POST',
        body: city,
      }),
      invalidatesTags: [{ type: 'Cities', id: 'LIST' }],
    }),

    // Update a city
    updateCity: builder.mutation<{ message: string }, UpdateCityRequest>({
      query: ({ cityId, ...updates }) => ({
        url: "/UpdateCity",
        method: 'PUT',
        body: updates,
        params: { cityId },
      }),
      invalidatesTags: (result, error, { cityId }) => [
        { type: 'Cities', id: cityId },
        { type: 'Cities', id: 'LIST' },
      ],
    }),

    // Delete a city
    deleteCity: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: "/DelCity",
        method: 'DELETE',
        params: { cityId: id },
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Cities', id },
        { type: 'Cities', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetAllCitiesQuery,
  useGetCityByIdQuery,
  useCreateCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
} = citiesApi

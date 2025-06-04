import { baseApi } from "./baseApi"
import type { ApiResponse, City, CreateCityRequest, DeleteCityRequest } from "@/types/api"

export const cityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCities: builder.query<City[], void>({
      query: () => "/web/api/v1/adminapp/GetAllCity",
      providesTags: ["Cities"],
    }),

    getCityById: builder.query<City, string>({
      query: (cityId) => ({
        url: "/web/api/v1/adminapp/GetCityById",
        params: { cityId },
      }),
      providesTags: (result, error, id) => [{ type: "Cities", id }],
    }),

    createCity: builder.mutation<ApiResponse<null>, CreateCityRequest>({
      query: (data) => ({
        url: "/web/api/v1/adminapp/CreateCity",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cities"],
    }),

    deleteCity: builder.mutation<ApiResponse<null>, DeleteCityRequest>({
      query: (data) => ({
        url: "/web/api/v1/adminapp/DelCity",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cities"],
    }),
  }),
})

export const { useGetCitiesQuery, useGetCityByIdQuery, useCreateCityMutation, useDeleteCityMutation } = cityApi

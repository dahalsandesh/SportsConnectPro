import { baseApi } from "../baseApi";
import type { ApiResponse, City, CreateCityRequest, DeleteCityRequest } from "@/types/api";

export const citiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCities: builder.query<City[], void>({
      query: () => "/web/api/v1/adminapp/GetAllCity",
      transformResponse: (response: ApiResponse<City[]>) => response.data || [],
      providesTags: ["Cities"],
    }),

    getCityById: builder.query<City, string>({
      query: (cityId) => ({
        url: "/web/api/v1/adminapp/v1/GetCityById",
        params: { cityId },
      }),
      transformResponse: (response: ApiResponse<City>) => response.data,
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
        url: "/web/api/v1/adminapp/v1/DelCity",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cities"],
    }),
  }),
});

export const {
  useGetCitiesQuery,
  useGetCityByIdQuery,
  useCreateCityMutation,
  useDeleteCityMutation,
} = citiesApi;

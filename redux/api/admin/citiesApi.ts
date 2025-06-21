import { baseApi } from "../baseApi";
import type { ApiResponse, City, CreateCityRequest, DeleteCityRequest } from "@/types/api";

export const citiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCities: builder.query<City[], void>({
      query: () => "/web/api/v1/adminapp/GetAllCity",
      // API returns array directly, so no transformResponse needed
      providesTags: (result) =>
        result
          ? [...result.map(({ cityId }) => ({ type: 'Cities' as const, id: cityId })), 'Cities']
          : ['Cities'],
    }),

    getCityById: builder.query<City, string>({
      query: (cityId) => ({
        url: "/web/api/v1/adminapp/GetCityById",
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
      invalidatesTags: ['Cities'],
    }),

    updateCity: builder.mutation<ApiResponse<null>, { cityId: string; cityName: string }>({
      query: (data) => ({
        url: "/web/api/v1/adminapp/UpdateCity",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { cityId }) => [
        { type: "Cities" as const, id: cityId },
        'Cities',
      ],
    }),

    deleteCity: builder.mutation<ApiResponse<null>, DeleteCityRequest>({
      query: (data) => ({
        url: "/web/api/v1/adminapp/DelCity",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { cityId }) => [
        { type: 'Cities', id: cityId },
        'Cities',
      ],
    }),
  }),
});

export const {
  useGetCitiesQuery,
  useGetCityByIdQuery,
  useCreateCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
} = citiesApi;

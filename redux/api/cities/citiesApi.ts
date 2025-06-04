import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../../store/reducers"
import { getBaseUrl } from "../baseApi"

export interface City {
  id: string
  name: string
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
    getAllCities: builder.query<City[], void>({
      query: () => "cities",
      providesTags: ["Cities"],
    }),
  }),
})

export const { useGetAllCitiesQuery } = citiesApi

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../../store/reducers"
import { getBaseUrl } from "../baseApi"

export interface Venue {
  id: string
  name: string
  address: string
  city: string
  status: string
  created_at: string
}

export const venuesApi = createApi({
  reducerPath: "venuesApi",
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
  tagTypes: ["Venues"],
  endpoints: (builder) => ({
    getAllVenues: builder.query<Venue[], void>({
      query: () => "venues",
      providesTags: ["Venues"],
    }),
    createVenue: builder.mutation<{ message: string }, FormData>({
      query: (data) => ({
        url: "venues",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Venues"],
    }),
    updateVenueStatus: builder.mutation<{ message: string }, { venueId: string; status: string }>({
      query: ({ venueId, status }) => ({
        url: `venues/${venueId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Venues"],
    }),
  }),
})

export const {
  useGetAllVenuesQuery,
  useCreateVenueMutation,
  useUpdateVenueStatusMutation,
} = venuesApi

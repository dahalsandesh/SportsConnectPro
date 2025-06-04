import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../../store/reducers"
import { getBaseUrl } from "../baseApi"

export interface VenueApplication {
  id: string
  venue_name: string
  applicant_name: string
  status: string
  applied_at: string
}

export const venueApplicationsApi = createApi({
  reducerPath: "venueApplicationsApi",
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
  tagTypes: ["VenueApplications"],
  endpoints: (builder) => ({
    getAllVenueApplications: builder.query<VenueApplication[], void>({
      query: () => "venue-applications",
      providesTags: ["VenueApplications"],
    }),

    getVenueApplicationById: builder.query<VenueApplication, string>({
      query: (id) => `venue-applications/${id}`,
      providesTags: (result, error, id) => [{ type: "VenueApplications", id }],
    }),
  }),
})

export const {
  useGetAllVenueApplicationsQuery,
  useGetVenueApplicationByIdQuery,
} = venueApplicationsApi

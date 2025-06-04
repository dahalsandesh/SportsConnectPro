import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../store"
import { getBaseUrl } from "../api/baseApi"

// Type definitions
interface SportTypeData {
  name: string
  count: number
}

interface DashboardData {
  sportTypes: SportTypeData[]
}

interface Venue {
  id: string
  name: string
  address: string
  city: string
  status: string
  created_at: string
}

interface VenueApplication {
  id: string
  venue_name: string
  applicant_name: string
  status: string
  applied_at: string
}

interface UserType {
  id: string
  name: string
  description: string
}

interface City {
  id: string
  name: string
}

// Create the API
export const adminApi = createApi({
  reducerPath: "adminApi",
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
  tagTypes: ["SportCategories", "Venues", "VenueApplications", "UserTypes", "Cities"],
  endpoints: (builder) => ({
    // Dashboard endpoints
    getSportTypeData: builder.query<DashboardData, void>({
      query: () => "dashboard/sport-types",
      providesTags: ["SportCategories"],
    }),

    // Venue endpoints
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

    // Venue Application endpoints
    getAllVenueApplications: builder.query<VenueApplication[], void>({
      query: () => "venue-applications",
      providesTags: ["VenueApplications"],
    }),

    getVenueApplicationById: builder.query<VenueApplication, string>({
      query: (id) => `venue-applications/${id}`,
      providesTags: (result, error, id) => [{ type: "VenueApplications", id }],
    }),

    // User Type endpoints
    getAllUserTypes: builder.query<UserType[], void>({
      query: () => "user-types",
      providesTags: ["UserTypes"],
    }),

    createUserType: builder.mutation<{ message: string }, { name: string; description: string }>({
      query: (data) => ({
        url: "user-types",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UserTypes"],
    }),

    deleteUserType: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `user-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserTypes"],
    }),

    // City endpoints
    getAllCities: builder.query<City[], void>({
      query: () => "cities",
      providesTags: ["Cities"],
    }),
  }),
})

export const {
  useGetSportTypeDataQuery,
  useGetAllVenuesQuery,
  useCreateVenueMutation,
  useUpdateVenueStatusMutation,
  useGetAllVenueApplicationsQuery,
  useGetVenueApplicationByIdQuery,
  useGetAllUserTypesQuery,
  useCreateUserTypeMutation,
  useDeleteUserTypeMutation,
  useGetAllCitiesQuery,
} = adminApi

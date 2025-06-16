import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../../store/reducers"
import { getBaseUrl } from "../baseApi"

// Define interfaces for the API
export interface Venue {
  venueId: string
  name: string
  address: string
  cityId: string
  cityName: string
  phoneNumber: string
  email: string
  ownerEmail: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateVenueRequest {
  ownerEmail: string
  name: string
  address: string
  cityId: string
  phoneNumber: string
  email: string
}

export interface UpdateVenueStatusRequest {
  venueId: string
  isActive: 0 | 1
}

// Create a separate API for venues
const api = createApi({
  reducerPath: 'venuesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/web/api/v1/venue`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set('Authorization', `token ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Venues'],
  endpoints: (builder) => ({
    // Get all venues for the owner
    getVenues: builder.query<Venue[], void>({
      query: () => ({
        url: "/GetVenueDetails",
      }),
      providesTags: (result) => {
        if (!result) return [{ type: 'Venues', id: 'LIST' }];
        if (Array.isArray(result)) {
          return [
            ...result.map(({ venueId }) => ({ type: 'Venues' as const, id: venueId })),
            { type: 'Venues', id: 'LIST' },
          ];
        }
        // If result is a single object
        return [
          { type: 'Venues' as const, id: result.venueId },
          { type: 'Venues', id: 'LIST' },
        ];
      },
    }),

    // Get venue by ID
    getVenueById: builder.query<Venue, string>({
      query: (id) => ({
        url: "/GetVenueDetails",
        params: { venueId: id },
      }),
      providesTags: (result, error, id) => [{ type: 'Venues' as const, id }],
    }),

    // Create a new venue
    createVenue: builder.mutation<{ message: string }, CreateVenueRequest>({
      query: (venue) => ({
        url: "/CreateVenue",
        method: "POST",
        body: venue,
      }),
      invalidatesTags: [{ type: 'Venues', id: 'LIST' }],
    }),

    // Update venue status (0 or 1 for isActive)
    updateVenueStatus: builder.mutation<{ message: string }, { venueId: string; isActive: 0 | 1 }>({
      query: ({ venueId, isActive }) => ({
        url: "/UpdateVenueStatus",
        method: "POST",
        body: { venueId, isActive },
      }),
      invalidatesTags: (result, error, { venueId }) => [
        { type: 'Venues' as const, id: venueId },
        { type: 'Venues' as const, id: 'LIST' },
      ],
    }),
  }),
})

// Export hooks for usage in functional components
export const {
  useGetVenuesQuery,
  useGetVenueByIdQuery,
  useCreateVenueMutation,
  useUpdateVenueStatusMutation,
} = api

export const venuesApi = api

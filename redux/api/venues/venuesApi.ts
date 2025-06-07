import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../../store/reducers"
import { getBaseUrl } from "../baseApi"

export interface Address {
  street: string
  city: string
  state: string
  country: string
  zipCode: string
  latitude?: number
  longitude?: number
}

export interface Venue {
  venueId: string
  venueName: string
  description: string
  address: Address
  contactNumber: string
  email: string
  openingTime: string
  closingTime: string
  isActive: boolean
  isVerified: boolean
  averageRating?: number
  totalReviews?: number
  amenities: string[]
  images: string[]
  sportTypeIds: string[]
  createdAt: string
  updatedAt: string
  createdBy?: string
  updatedBy?: string
}

export interface CreateVenueRequest {
  venueName: string
  description: string
  address: Omit<Address, 'latitude' | 'longitude'> & {
    latitude?: number
    longitude?: number
  }
  contactNumber: string
  email: string
  openingTime: string
  closingTime: string
  sportTypeIds: string[]
  amenities?: string[]
  images?: File[]
}

export interface UpdateVenueRequest extends Partial<CreateVenueRequest> {
  venueId: string
}

export interface VenueResponse {
  message: string
  data?: Venue
}

export interface VenuesResponse {
  data: Venue[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const venuesApi = createApi({
  reducerPath: "venuesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/web/api/v1`,
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
    // Get all venues with pagination and filters
    getVenues: builder.query<VenuesResponse, { 
      page?: number
      limit?: number
      city?: string
      sportTypeId?: string
      search?: string
      isVerified?: boolean
    }>({
      query: (params) => ({
        url: "/venues",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          ...(params.city && { city: params.city }),
          ...(params.sportTypeId && { sportTypeId: params.sportTypeId }),
          ...(params.search && { search: params.search }),
          ...(typeof params.isVerified === 'boolean' && { isVerified: params.isVerified }),
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ venueId }) => ({ type: 'Venues' as const, id: venueId })),
              { type: 'Venues', id: 'LIST' },
            ]
          : [{ type: 'Venues', id: 'LIST' }],
    }),

    // Get venue by ID
    getVenueById: builder.query<{ data: Venue }, string>({
      query: (id) => `/venues/${id}`,
      providesTags: (result, error, id) => [{ type: 'Venues', id }],
    }),

    // Create a new venue
    createVenue: builder.mutation<VenueResponse, FormData>({
      query: (formData) => ({
        url: "/venues",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: 'Venues', id: 'LIST' }],
    }),

    // Update a venue
    updateVenue: builder.mutation<VenueResponse, { venueId: string; data: FormData }>({
      query: ({ venueId, data }) => ({
        url: `/venues/${venueId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { venueId }) => [
        { type: 'Venues', id: venueId },
        { type: 'Venues', id: 'LIST' },
      ],
    }),

    // Delete a venue
    deleteVenue: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/venues/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Venues', id },
        { type: 'Venues', id: 'LIST' },
      ],
    }),

    // Update venue status (approve/reject)
    updateVenueStatus: builder.mutation<{ message: string }, { venueId: string; status: 'APPROVED' | 'REJECTED' | 'PENDING' }>({
      query: ({ venueId, status }) => ({
        url: `/admin/venues/${venueId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { venueId }) => [
        { type: 'Venues', id: venueId },
        { type: 'Venues', id: 'LIST' },
      ],
    }),

    // Get venues by owner
    getMyVenues: builder.query<VenuesResponse, { 
      page?: number
      limit?: number
      status?: 'PENDING' | 'APPROVED' | 'REJECTED'
    }>({
      query: (params = {}) => ({
        url: "/my/venues",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          ...(params.status && { status: params.status }),
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ venueId }) => ({ type: 'Venues' as const, id: venueId, owner: 'ME' })),
              { type: 'Venues', id: 'MY_LIST' },
            ]
          : [{ type: 'Venues', id: 'MY_LIST' }],
    }),
  }),
})

export const {
  useGetVenuesQuery,
  useGetVenueByIdQuery,
  useCreateVenueMutation,
  useUpdateVenueMutation,
  useDeleteVenueMutation,
  useUpdateVenueStatusMutation,
  useGetMyVenuesQuery,
} = venuesApi

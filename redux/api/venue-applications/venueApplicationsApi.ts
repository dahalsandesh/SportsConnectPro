import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../../store/reducers"
import { getBaseUrl } from "../baseApi"

export interface VenueApplication {
  ID: string
  Applicant_id: string
  VenueName: string
  Address: string
  City_id: string
  PhoneNumber: string
  Email: string
  PanNumber: string
  Status: 'pending' | 'approved' | 'rejected'
  AdminRemark: string
  IsActive: boolean
  CreatedAt: string
  reviewed_at: string | null
  document?: Array<{
    file: string
    docType: string
  }>
}

export const venueApplicationsApi = createApi({
  reducerPath: "venueApplicationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/web/api/v1/adminapp`,
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
      query: () => "GetVenueApplication",
      providesTags: ["VenueApplications"],
    }),

    getVenueApplicationById: builder.query<VenueApplication, string>({
      query: (id) => `GetVenueApplicationById?applicationId=${id}`,
      providesTags: (result, error, id) => [{ type: "VenueApplications", id }],
    }),

    updateVenueApplicationStatus: builder.mutation<{ message: string }, { 
      applicationId: string; 
      status: 'approved' | 'rejected';
      adminRemark?: string;
    }>({
      query: ({ applicationId, status, adminRemark }) => ({
        url: 'UpdateVenueApplication',
        method: 'POST',
        body: {
          applicationId,
          status,
          adminRemark: adminRemark || '',
        },
      }),
      invalidatesTags: (result, error, { applicationId }) => [
        { type: 'VenueApplications' as const, id: applicationId },
        { type: 'VenueApplications' as const },
      ],
    }),
  }),
})

export const {
  useGetAllVenueApplicationsQuery,
  useGetVenueApplicationByIdQuery,
  useUpdateVenueApplicationStatusMutation,
} = venueApplicationsApi

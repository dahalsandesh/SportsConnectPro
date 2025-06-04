import { baseApi } from "./baseApi"
import type { ApiResponse } from "@/types/api"

export interface VenueApplication {
  ID: string
  Applicant_id: string
  VenueName: string
  Address: string
  City_id: string
  PhoneNumber: string
  Email: string
  PanNumber: string
  Status: string
  AdminRemark: string
  IsActive: boolean
  CreatedAt: string
  reviewed_at: string | null
}

export interface VenueApplicationDetail extends VenueApplication {
  document: VenueDocument[]
}

export interface VenueDocument {
  file: string
  docType: string
}

export interface UpdateApplicationStatusRequest {
  applicationId: string
  status: string
}

export const venueApplicationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVenueApplications: builder.query<VenueApplication[], void>({
      query: () => "/web/api/v1/adminapp/GetVenueApplication",
      providesTags: ["VenueApplications"],
    }),

    getVenueApplicationById: builder.query<VenueApplicationDetail, string>({
      query: (applicationId) => ({
        url: "/web/api/v1/adminapp/GetVenueApplicationById",
        params: { applicationId },
      }),
      providesTags: (result, error, id) => [{ type: "VenueApplications", id }],
    }),

    updateVenueApplicationStatus: builder.mutation<ApiResponse<null>, UpdateApplicationStatusRequest>({
      query: (data) => ({
        url: "/web/api/v1/adminapp/UpdateVenueApplication",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["VenueApplications"],
    }),
  }),
})

export const {
  useGetVenueApplicationsQuery,
  useGetVenueApplicationByIdQuery,
  useUpdateVenueApplicationStatusMutation,
} = venueApplicationsApi

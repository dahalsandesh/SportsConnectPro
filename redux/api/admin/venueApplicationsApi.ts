import { baseApi } from "../baseApi";
import type { ApiResponse, VenueApplication, UpdateVenueApplicationStatusRequest } from '@/types/api';

export const venueApplicationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllVenueApplications: builder.query<VenueApplication[], void>({
      query: () => "/web/api/v1/adminapp/GetVenueApplication",
      providesTags: ["VenueApplications"],
    }),

    getVenueApplicationById: builder.query<VenueApplication, string>({
      query: (id) => `/web/api/v1/adminapp/GetVenueApplicationById?applicationId=${id}`,
      providesTags: (result, error, id) => [{ type: "VenueApplications", id }],
    }),

    updateVenueApplicationStatus: builder.mutation<ApiResponse<null>, UpdateVenueApplicationStatusRequest>({ 
      query: (data) => ({
        url: '/web/api/v1/adminapp/UpdateVenueApplication',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { applicationId }) => [
        { type: 'VenueApplications' as const, id: applicationId },
        { type: 'VenueApplications' as const },
      ],
    }),
  }),
});

export const {
  useGetAllVenueApplicationsQuery,
  useGetVenueApplicationByIdQuery,
  useUpdateVenueApplicationStatusMutation,
} = venueApplicationsApi;

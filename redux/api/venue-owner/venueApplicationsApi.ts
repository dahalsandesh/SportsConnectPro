import { baseApi } from "../baseApi";
import type { ApiResponse } from '@/types/api';

export const venueApplicationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createVenueApplication: builder.mutation<ApiResponse<null>, FormData>({
      query: (formData) => ({
        url: "/web/api/v1/venue/applications",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["VenueApplications"],
    }),
  }),
});

export const {
  useCreateVenueApplicationMutation,
} = venueApplicationsApi;

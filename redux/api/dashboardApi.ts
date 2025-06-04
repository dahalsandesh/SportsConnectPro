import { baseApi } from "./baseApi"
import type { DashboardData } from "@/types/api"

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query<DashboardData, void>({
      query: () => "/web/api/v1/adminapp/DashboardData",
      providesTags: ["Dashboard"],
    }),
  }),
})

export const { useGetDashboardDataQuery } = dashboardApi

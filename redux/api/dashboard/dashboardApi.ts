import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../../store/reducers"
import { getBaseUrl } from "../baseApi"

interface SportTypeData {
  name: string
  count: number
}

export interface DashboardData {
  sportTypes: SportTypeData[]
}

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
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
  tagTypes: ["Dashboard"],
  endpoints: (builder) => ({
    getSportTypeData: builder.query<DashboardData, void>({
      query: () => "dashboard/sport-types",
      providesTags: ["Dashboard"],
    }),
  }),
})

export const { useGetSportTypeDataQuery } = dashboardApi

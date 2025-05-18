import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../store"

// Create our base API with shared configuration
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get token from state
      const token = (getState() as RootState).auth.token

      // If token exists, add authorization header
      if (token) {
        headers.set("authorization", `token ${token}`)
      }

      return headers
    },
  }),
  tagTypes: ["UserTypes", "Cities", "PaymentTypes", "Statuses", "SportCategories", "Genders", "Dashboard"],
  endpoints: () => ({}),
})

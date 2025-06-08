import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../store/reducers"

// Get base URL from environment variables with fallback
export const getBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:8000';
  // Ensure the URL has a protocol and doesn't end with a slash
  let url = baseUrl.trim();
  if (!url.startsWith('http')) {
    url = `http://${url}`;
  }
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

// Create our base API with shared configuration
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
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
  tagTypes: [
    // Core entities
    "UserTypes",
    "Cities",
    "PaymentTypes",
    "Statuses",
    "SportCategories",
    "Genders",
    
    // Business domains
    "Dashboard",
    "Posts",
    "VenueApplications",
    "Venues",
    "Courts",
    "Profile",
    "Bookings",
    
    // Newly added tags
    "Sports",
    "TimeSlots",
    "Reviews",
    "Payments",
    "Notifications"
  ],
  endpoints: () => ({}),
})

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
      let token = (getState() as RootState).auth.token
      
      // If token is not in state, try to get it from localStorage
      if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('token')
        console.log('Retrieved token from localStorage:', token ? 'Token exists' : 'No token found')
      } else if (token) {
        console.log('Using token from Redux state')
      }

      // If token exists, add authorization header
      if (token) {
        const authHeader = `token ${token}`
        headers.set("Authorization", authHeader)
        console.log('Authorization header set with token')
      } else {
        console.warn('No authentication token found')
      }

      // Add required headers for CORS and content type
      headers.set('Content-Type', 'application/json')
      headers.set('Accept', 'application/json')

      // Log final headers for debugging
      console.log('Request headers:', {
        'Content-Type': headers.get('Content-Type'),
        'Accept': headers.get('Accept'),
        'Authorization': headers.get('Authorization') ? 'token [REDACTED]' : 'Not set'
      })

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
    "Notifications",
    "Users",
    "VenuePosts",
    
    // Additional tags for venue management
    "SportsEvents",
    "VenueEvents",
    "VenueImages"
  ],
  endpoints: () => ({}),
})

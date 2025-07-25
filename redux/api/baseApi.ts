import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../store/reducers"

// Get base URL from environment variables with fallback
export const getBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.18.250:8000';
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
    paramsSerializer: (params) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      return searchParams.toString();
    },
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

      // If token exists, add authorization header and user ID
      if (token) {
        const authHeader = `token ${token}`
        headers.set("Authorization", authHeader)
        
        // Get user from state
        const user = (getState() as RootState).auth.user;
        if (user?.id) {
          headers.set('X-User-Id', user.id);
        }
        
        console.log('Authorization header set with token');
      } else {
        console.warn('No authentication token found');
      }

      // Add required headers for CORS and content type
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
    "VenueOwnerBookings",
    "Tickets",
    "PaymentTypes",
    "Statuses",
    "SportCategories",
    "Genders",
    "Events",
    "AdminNotifications",
    
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
    "Reels",
    "Reviews",
    "Payments",
    "Notifications",
    "Users",
    "VenuePosts",
    
    // Additional tags for venue management
    "SportsEvents",
    "VenueEvents",
    "VenueImages",
    "VenuePaymentMethods",
    "SecretKey",
    "RegisteredEvents",
    
    // Public API tags
    "PublicCourts"
  ],
  endpoints: () => ({}),
})

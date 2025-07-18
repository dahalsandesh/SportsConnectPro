import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../store/reducers"

// Get base URL from environment variables with fallback
export const getBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/web/api/v1';
  // Ensure the URL has a protocol and doesn't end with a slash
  let url = baseUrl.trim();
  if (!url.startsWith('http')) {
    url = `http://${url}`;
  }
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

// Create base query with auth headers
const baseQuery = fetchBaseQuery({
  baseUrl: getBaseUrl(),
  prepareHeaders: (headers, { getState }) => {
    // Get token from state
    const state = getState() as RootState;
    let token = state.auth?.token;
    
    // If token is not in state, try to get it from localStorage
    if ((!token || token === 'undefined') && typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        try {
          token = JSON.parse(storedToken);
          console.log('Retrieved token from localStorage');
        } catch (e) {
          console.warn('Failed to parse token from localStorage', e);
        }
      } else {
        console.warn('No token found in localStorage');
      }
    }

    // If token exists, add authorization header
    if (token) {
      headers.set('Authorization', `token ${token}`);
      
      // Add user ID if available
      if (state.auth?.user?.userId) {
        headers.set('X-User-Id', state.auth.user.userId);
      }
      
      console.log('Authorization header set with token');
    } else {
      console.warn('No authentication token found for the request');
    }

    // Set default headers
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    
    // Add cache control headers
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');

    return headers;
  },
  paramsSerializer: (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    return searchParams.toString();
  },
});

// Create our base API with shared configuration
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: async (args, api, extraOptions) => {
    console.log('API Request:', {
      url: args.url,
      method: args.method,
      body: args.body,
      params: args.params,
    });

    try {
      const result = await baseQuery(args, api, extraOptions);
      console.log('API Response:', {
        url: args.url,
        status: result.meta?.response?.status,
        data: result.data,
        error: result.error,
      });
      return result;
    } catch (error) {
      console.error('API Error:', {
        url: args.url,
        error,
      });
      throw error;
    }
  },
  tagTypes: [
    // Core entities
    'UserTypes',
    'Cities',
    'VenueOwnerBookings',
    'Tickets',
    'PaymentTypes',
    'Statuses',
    'SportCategories',
    'Genders',
    'Events',
    'AdminNotifications',
    
    // Business domains
    'Dashboard',
    'Posts',
    'VenueApplications',
    'Venues',
    'Courts',
    'Profile',
    'Bookings',
    
    // Newly added tags
    'Sports',
    'TimeSlots',
    'Reels',
    'Reviews',
    'Payments',
    'Notifications',
    'Users',
    'VenuePosts',
    
    // Additional tags for venue management
    'SportsEvents',
    'VenueEvents',
    'VenueImages',
    'VenuePaymentMethods',
  ],
  endpoints: () => ({}),
});

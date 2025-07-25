import { baseApi } from "../api/baseApi";
import { bookingsApi } from "../api/user/bookingsApi";
import { publicApi } from "../api/publicApi";
import { authApi } from "../api/common/authApi";
import { userApi } from "../api/user/userApi";
import { courtApi } from "../api/venue-owner/courtApi";

// Get unique middlewares by using a Set to prevent duplicates
// Note: Order matters - more specific APIs should come before more general ones
const middlewares = new Set([
  // Register venue-owner API first with explicit path
  { middleware: courtApi.middleware, path: courtApi.reducerPath },
  // Then other APIs
  { middleware: baseApi.middleware, path: baseApi.reducerPath },
  { middleware: authApi.middleware, path: authApi.reducerPath },
  { middleware: userApi.middleware, path: userApi.reducerPath },
  { middleware: bookingsApi.middleware, path: bookingsApi.reducerPath },
  // Public API should be last
  { middleware: publicApi.middleware, path: publicApi.reducerPath }
].filter(Boolean).map(api => api.middleware)); // Filter out any undefined middlewares and extract middleware

// Convert back to array for the store configuration
export const apiMiddlewares = Array.from(middlewares);

import { baseApi } from "../api/baseApi";
import { bookingsApi } from "../api/user/bookingsApi";
import { publicApi } from "../api/publicApi";
import { authApi } from "../api/common/authApi";
import { userApi } from "../api/user/userApi";

// Get unique middlewares by using a Set to prevent duplicates
const middlewares = new Set([
  baseApi.middleware,
  bookingsApi.middleware,
  publicApi.middleware,
  authApi.middleware,
  userApi.middleware
].filter(Boolean)); // Filter out any undefined middlewares

// Convert back to array for the store configuration
export const apiMiddlewares = Array.from(middlewares);

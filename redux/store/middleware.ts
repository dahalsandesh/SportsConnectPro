import { baseApi } from "../api/baseApi";
import { bookingsApi } from "../api/user/bookingsApi";
import { publicApi } from "../api/publicApi";

// Get unique middlewares by using a Set to prevent duplicates
const middlewares = new Set([
  baseApi.middleware,
  bookingsApi.middleware,
  publicApi.middleware
]);

// Convert back to array for the store configuration
export const apiMiddlewares = Array.from(middlewares);

import { baseApi } from "../api/baseApi";
import { bookingsApi } from "../api/user/bookingsApi";

// Include all API middlewares
export const apiMiddlewares = [
  baseApi.middleware,
  bookingsApi.middleware
];

import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import { baseApi } from "../api/baseApi";
import { bookingsApi } from "../api/user/bookingsApi";
import { authApi } from "../api/common/authApi";
import { publicApi } from "../api/publicApi";
import { userApi } from "../api/user/userApi";
import { courtApi } from "../api/venue-owner/courtApi";

// Combine all reducers
// Note: Order matters - more specific APIs should come before more general ones
export const rootReducer = combineReducers({
  auth: authReducer,
  // Register venue-owner API first
  [courtApi.reducerPath]: courtApi.reducer,
  // Then other APIs
  [baseApi.reducerPath]: baseApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [bookingsApi.reducerPath]: bookingsApi.reducer,
  // Public API should be last
  [publicApi.reducerPath]: publicApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>

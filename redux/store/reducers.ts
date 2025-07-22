import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import { baseApi } from "../api/baseApi";
import { bookingsApi } from "../api/user/bookingsApi";
import { authApi } from "../api/common/authApi";
import { publicApi } from "../api/publicApi";
import { userApi } from "../api/user/userApi";

// Combine all reducers
export const rootReducer = combineReducers({
  auth: authReducer,
  [baseApi.reducerPath]: baseApi.reducer,
  [bookingsApi.reducerPath]: bookingsApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [publicApi.reducerPath]: publicApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>

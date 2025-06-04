import { combineReducers } from "@reduxjs/toolkit"
import authReducer from "../features/authSlice"
import { dashboardApi } from "../api/dashboard/dashboardApi"
import { venuesApi } from "../api/venues/venuesApi"
import { venueApplicationsApi } from "../api/venue-applications/venueApplicationsApi"
import { userTypesApi } from "../api/user-types/userTypesApi"
import { citiesApi } from "../api/cities/citiesApi"
import { authApi } from "../services/authApi"
import { baseApi } from "../api/baseApi"
import { bookingApi } from "../api/bookingApi"

// Combine all API reducers
const apiReducers = {
  [dashboardApi.reducerPath]: dashboardApi.reducer,
  [venuesApi.reducerPath]: venuesApi.reducer,
  [venueApplicationsApi.reducerPath]: venueApplicationsApi.reducer,
  [userTypesApi.reducerPath]: userTypesApi.reducer,
  [citiesApi.reducerPath]: citiesApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [baseApi.reducerPath]: baseApi.reducer,
  [bookingApi.reducerPath]: bookingApi.reducer,
}

// Combine all reducers
export const rootReducer = combineReducers({
  auth: authReducer,
  ...apiReducers,
})

export type RootState = ReturnType<typeof rootReducer>

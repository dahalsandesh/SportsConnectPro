import { combineReducers } from "@reduxjs/toolkit"
import authReducer from "../features/authSlice"
import { baseApi } from "../api/baseApi"
import { venuesApi } from "../api/venues/venuesApi"
import { citiesApi } from "../api/cities/citiesApi"
import { venueApplicationsApi } from "../api/venue-applications/venueApplicationsApi"
import { bookingsApi } from "../api/bookings/bookingsApi"
import { authApi } from "../services/authApi"

// Combine all reducers
export const rootReducer = combineReducers({
  auth: authReducer,
  [baseApi.reducerPath]: baseApi.reducer,
  [venuesApi.reducerPath]: venuesApi.reducer,
  [citiesApi.reducerPath]: citiesApi.reducer,
  [venueApplicationsApi.reducerPath]: venueApplicationsApi.reducer,
  [bookingsApi.reducerPath]: bookingsApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
})

export type RootState = ReturnType<typeof rootReducer>

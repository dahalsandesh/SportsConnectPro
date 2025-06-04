import { dashboardApi } from "../api/dashboard/dashboardApi"
import { venuesApi } from "../api/venues/venuesApi"
import { venueApplicationsApi } from "../api/venue-applications/venueApplicationsApi"
import { userTypesApi } from "../api/user-types/userTypesApi"
import { citiesApi } from "../api/cities/citiesApi"
import { authApi } from "../services/authApi"
import { baseApi } from "../api/baseApi"
import { bookingApi } from "../api/bookingApi"

export const apiMiddlewares = [
  dashboardApi.middleware,
  venuesApi.middleware,
  venueApplicationsApi.middleware,
  userTypesApi.middleware,
  citiesApi.middleware,
  authApi.middleware,
  baseApi.middleware,
  bookingApi.middleware,
]

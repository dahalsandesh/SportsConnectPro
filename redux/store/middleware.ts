import { baseApi } from "../api/baseApi"
import { citiesApi } from "../api/cities/citiesApi"
import { venuesApi } from "../api/venues/venuesApi"
import { venueApplicationsApi } from "../api/venue-applications/venueApplicationsApi"
import { bookingsApi } from "../api/bookings/bookingsApi"

// Include all API middlewares
export const apiMiddlewares = [
  baseApi.middleware,
  citiesApi.middleware,
  venuesApi.middleware,
  venueApplicationsApi.middleware,
  bookingsApi.middleware
]

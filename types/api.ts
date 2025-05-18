// Common types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// User Type API types
export interface UserType {
  userTypeId: string
  userType: string
}

export interface CreateUserTypeRequest {
  userType: string
}

export interface DeleteUserTypeRequest {
  userTypeId: string
}

// City API types
export interface City {
  cityId: string
  cityName: string
}

export interface CreateCityRequest {
  cityName: string
}

export interface DeleteCityRequest {
  cityId: string
}

// Payment Type API types
export interface PaymentType {
  paymentTypeId: string
  paymentTypeName: string
}

export interface CreatePaymentTypeRequest {
  paymentTypeName: string
}

export interface DeletePaymentTypeRequest {
  paymentTypeId: string
}

// Status API types
export interface Status {
  statusId: string
  status: string
}

export interface CreateStatusRequest {
  status: string
}

export interface DeleteStatusRequest {
  statusId: string
}

// Sport Category API types
export interface SportCategory {
  sportCategoryId: string
  sportCategory: string
}

export interface CreateSportCategoryRequest {
  sportCategory: string
}

export interface DeleteSportCategoryRequest {
  sportCategoryId: string
}

// Gender API types
export interface Gender {
  genderId: string
  gender: string
}

export interface CreateGenderRequest {
  gender: string
}

export interface DeleteGenderRequest {
  genderId: string
}

// Dashboard API types
export interface DashboardData {
  normal_user_count: number
  venue_user_count: number
  admin_user_count: number
  venue_count: number
  court_count: number
  venue_application_count: number
  booking_count: number
  total_income: number
}

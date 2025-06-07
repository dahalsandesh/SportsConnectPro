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
  totalPages: number
}

// Base entity interface
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
  isActive?: boolean
}

// Common query params
export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface DateRangeParams {
  startDate?: string
  endDate?: string
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

// ========== Sports API Types ==========
export interface Sport extends BaseEntity {
  name: string
  description?: string
  imageUrl?: string
  icon?: string
  category?: string
}

export interface CreateSportRequest {
  name: string
  description?: string
  imageUrl?: string
  icon?: string
  category?: string
}

export interface UpdateSportRequest extends Partial<CreateSportRequest> {
  id: string
}

export interface DeleteSportRequest {
  id: string
}

// ========== Time Slots API Types ==========
export interface TimeSlot extends BaseEntity {
  venueId: string
  courtId: string
  date: string
  startTime: string
  endTime: string
  isAvailable: boolean
  price?: number
  currency?: string
}

export interface CreateTimeSlotRequest {
  venueId: string
  courtId: string
  date: string
  startTime: string
  endTime: string
  price?: number
  currency?: string
}

export interface UpdateTimeSlotRequest extends Partial<CreateTimeSlotRequest> {
  id: string
  isAvailable?: boolean
}

export interface DeleteTimeSlotRequest {
  id: string
}

export interface TimeSlotQueryParams extends PaginationParams, DateRangeParams {
  venueId?: string
  courtId?: string
  date?: string
  isAvailable?: boolean
  sportType?: string
}

// ========== Reviews API Types ==========
export interface Review extends BaseEntity {
  userId: string
  venueId: string
  bookingId?: string
  rating: number
  comment?: string
  user?: {
    id: string
    name: string
    avatar?: string
  }
}

export interface CreateReviewRequest {
  venueId: string
  bookingId?: string
  rating: number
  comment?: string
}

export interface UpdateReviewRequest {
  id: string
  rating?: number
  comment?: string
}

export interface DeleteReviewRequest {
  id: string
}

export interface ReviewQueryParams extends PaginationParams {
  venueId?: string
  userId?: string
  minRating?: number
  maxRating?: number
}

// ========== Payments API Types ==========
export interface Payment extends BaseEntity {
  userId: string
  bookingId: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod: string
  transactionId?: string
  receiptUrl?: string
  metadata?: Record<string, any>
}

export interface PaymentIntentRequest {
  amount: number
  currency: string
  bookingId: string
  paymentMethodId?: string
  savePaymentMethod?: boolean
}

export interface PaymentIntentResponse {
  clientSecret: string
  requiresAction: boolean
  paymentIntentId: string
}

export interface ProcessPaymentRequest {
  paymentIntentId: string
  paymentMethodId?: string
  savePaymentMethod?: boolean
}

export interface RefundPaymentRequest {
  paymentId: string
  amount?: number
  reason?: string
}

export interface PaymentQueryParams extends PaginationParams, DateRangeParams {
  userId?: string
  bookingId?: string
  status?: string
  minAmount?: number
  maxAmount?: number
}

// ========== Notifications API Types ==========
export interface Notification extends BaseEntity {
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'booking' | 'payment' | 'system'
  isRead: boolean
  actionUrl?: string
  metadata?: Record<string, any>
}

export interface CreateNotificationRequest {
  userId: string
  title: string
  message: string
  type?: Notification['type']
  actionUrl?: string
  metadata?: Record<string, any>
}

export interface MarkAsReadRequest {
  id: string
}

export interface NotificationQueryParams extends PaginationParams {
  isRead?: boolean
  type?: string
  userId?: string
}

// ========== Booking API Types ==========
export interface Booking {
  id: string
  bookingId: string
  userId: string
  courtId: string
  venueId: string
  bookingDate: string
  startTime: string
  endTime: string
  status: string
  paymentStatus: string
  amount: number
  paymentMethod?: string
  notes?: string
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    name: string
    email: string
  }
  court?: {
    id: string
    name: string
    sportType: string
  }
  venue?: {
    id: string
    name: string
    address: string
  }
}

export interface CreateBookingRequest {
  courtId: string
  venueId: string
  bookingDate: string
  startTime: string
  endTime: string
  notes?: string
  paymentMethod?: string
}

export interface UpdateBookingRequest {
  id: string
  status?: string
  paymentStatus?: string
  notes?: string
  startTime?: string
  endTime?: string
}

export interface CancelBookingRequest {
  id: string
  reason?: string
}

export interface BookingFilterParams {
  userId?: string
  venueId?: string
  courtId?: string
  status?: string
  paymentStatus?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

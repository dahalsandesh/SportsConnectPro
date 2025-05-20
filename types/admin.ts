// Dashboard Data
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

// User Types
export interface UserTypeResponse {
  userTypeId: string
  userType: string
}

// Cities
export interface CityResponse {
  cityId: string
  cityName: string
}

// Payment Types
export interface PaymentTypeResponse {
  paymentTypeId: string
  paymentTypeName: string
}

// Statuses
export interface StatusResponse {
  statusId: string
  status: string
}

// Sport Categories
export interface SportCategoryResponse {
  sportCategoryId: string
  sportCategory: string
}

// Genders
export interface GenderResponse {
  genderId: string
  gender: string
}

// Venues
export interface VenueResponse {
  venueID: string
  ownerEmail: string
  name: string
  address: string
  phoneNumber: string
  isActive: boolean
  city: string
}

export interface VenueDetailResponse {
  venueID: string
  name: string
  address: string
  city: string
  latitude: string | null
  longitude: string | null
  phoneNumber: string
  email: string
  description: string
  openingTime: string | null
  closingTime: string | null
  isActive: boolean
  createdAt: string
  owner: {
    firstName: string
    lastName: string
    email: string
  }
  venueImages: VenueImage[]
  courts: Court[]
}

export interface VenueImage {
  imageId: string
  imageUrl: string
}

export interface Court {
  courtId: string
  name: string
  sportCategory: string
  pricePerHour: number
  isActive: boolean
}

export interface CreateVenueRequest {
  ownerEmail: string
  name: string
  address: string
  cityId: string
  phoneNumber: string
  email: string
}

export interface UpdateVenueStatusRequest {
  venueId: string
  isActive: boolean | number
}

// Venue Applications
export interface VenueApplicationResponse {
  ID: string
  Applicant_id: string
  VenueName: string
  Address: string
  City_id: string
  PhoneNumber: string
  Email: string
  PanNumber: string
  Status: string
  AdminRemark: string
  IsActive: boolean
  CreatedAt: string
  reviewed_at: string | null
}

export interface VenueApplicationDetailResponse extends VenueApplicationResponse {
  document: VenueDocument[]
}

export interface VenueDocument {
  file: string
  docType: string
}

// Posts (News & Media)
export interface PostResponse {
  postID: string
  title: string
  description: string
  category: string
  date: string
  time: string
  postImage: string
}

export interface UpdatePostRequest {
  postId: string
  title: string
  description: string
  categoryId: string
  date: string
  time: string
  postImage?: string
}

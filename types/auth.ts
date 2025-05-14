export enum UserType {
  Admin = "Admin",
  VenueOwner = "VenueOwner",
  NormalUsers = "NormalUsers",
}

export interface User {
  id: string
  userName: string
  email: string
  fullName?: string
  phoneNumber?: string
  userType: UserType
  profileImage?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User
  token: string | null
  isAuthenticated: boolean
  loading: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  firstName: string
  lastName: string
  email: string
  userName: string
  password: string
  phoneNumber: string
}

export interface AuthResponse {
  id: string
  userName: string
  email: string
  fullName: string
  phoneNumber: string
  userType: UserType
  profileImage?: string
  isVerified: boolean
  token: string
  createdAt: string
  updatedAt: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}

export interface VerifyEmailRequest {
  token: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  profileImage?: string
}

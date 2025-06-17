export interface SignupRequest {
  firstName: string
  lastName: string
  email: string
  userName: string
  password: string
  phoneNumber: string
}

export interface SignupResponse {
  message: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  email: string
  userName: string
  fullName: string
  phoneNumber: string
  userType: UserType
}

export interface LogoutResponse {
  message: string
}

export interface SendOtpRequest {
  email: string
}

export interface SendOtpResponse {
  message: string
}

export interface VerifyOtpRequest {
  email: string
  otp: string
}

export interface VerifyOtpResponse {
  message: string
}

export interface ChangePasswordRequest {
  email: string
  password: string
  password1: string
}

export interface ChangePasswordResponse {
  message: string
}

export enum UserType {
  NormalUsers = "NormalUsers",
  VenueOwner = "VenueOwner",
  VenueUsers = "VenueUsers",
  Admin = "Admin",
  SuperUsers = "SuperUsers",
}

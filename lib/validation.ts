import { z } from "zod"

// Common validation schemas
export const emailSchema = z.string().min(1, "Email is required").email("Please enter a valid email address")

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")

export const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .regex(/^\+?[\d\s\-$$$$]+$/, "Please enter a valid phone number")

export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters")

// Auth schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
})

export const signupSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    userName: z
      .string()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be less than 20 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    phoneNumber: phoneSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

// Venue schemas
export const venueSchema = z.object({
  name: z
    .string()
    .min(1, "Venue name is required")
    .min(3, "Venue name must be at least 3 characters")
    .max(100, "Venue name must be less than 100 characters"),
  address: z.string().min(1, "Address is required").min(10, "Please provide a complete address"),
  cityId: z.string().min(1, "Please select a city"),
  phoneNumber: phoneSchema,
  email: emailSchema,
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  openingTime: z.string().optional(),
  closingTime: z.string().optional(),
})

export const venueApplicationSchema = z.object({
  venueName: z.string().min(1, "Venue name is required").min(3, "Venue name must be at least 3 characters"),
  address: z.string().min(1, "Address is required"),
  cityId: z.string().min(1, "Please select a city"),
  phoneNumber: phoneSchema,
  email: emailSchema,
  panNumber: z
    .string()
    .min(1, "PAN number is required")
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Please enter a valid PAN number"),
})

// Booking schemas
export const bookingSchema = z.object({
  venueId: z.string().min(1, "Please select a venue"),
  date: z.string().min(1, "Please select a date"),
  startTime: z.string().min(1, "Please select start time"),
  endTime: z.string().min(1, "Please select end time"),
  notes: z.string().max(200, "Notes must be less than 200 characters").optional(),
})

// Utility functions
export function validateField<T>(schema: z.ZodSchema<T>, value: T): string | null {
  try {
    schema.parse(value)
    return null
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || "Invalid value"
    }
    return "Validation error"
  }
}

export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: T,
): {
  isValid: boolean
  errors: Record<string, string>
} {
  try {
    schema.parse(data)
    return { isValid: true, errors: {} }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path[0] as string] = err.message
        }
      })
      return { isValid: false, errors }
    }
    return { isValid: false, errors: { general: "Validation error" } }
  }
}

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type VenueFormData = z.infer<typeof venueSchema>
export type VenueApplicationFormData = z.infer<typeof venueApplicationSchema>
export type BookingFormData = z.infer<typeof bookingSchema>

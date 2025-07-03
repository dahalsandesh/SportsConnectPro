"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/hooks/redux"
import { UserType } from "@/types/auth"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserType | UserType[]
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth)
  const router = useRouter()

  // Always render the same output during SSR and first client render
  // Only perform redirects in useEffect (client-side)
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login")
      return
    }

    if (!loading && isAuthenticated && requiredRole && user) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]

      // Check if user has the required role
      if (!roles.includes(user.userType)) {
        console.log("User type:", user.userType, "Required roles:", roles)

        // Redirect based on user type
        switch (user.userType) {
          case UserType.Admin:
            router.replace("/admin")
            break
          case UserType.VenueUsers:
            router.replace("/venue-owner")
            break
          case UserType.SuperUsers:
            router.replace("http://localhost:8000/admin")
            break
          default:
            router.replace("/dashboard")
        }
      }
    }
  }, [isAuthenticated, loading, router, user, requiredRole])

  // Show loading state
  if (loading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is authenticated but doesn't have the required role, show unauthorized message
  if (requiredRole && user) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    if (!roles.includes(user.userType)) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-red-500">
          <h2 className="text-2xl font-bold mb-2">Unauthorized</h2>
          <p>You do not have permission to access this page.</p>
          <p className="text-sm text-gray-500 mt-2">
            Your role: {user.userType}, Required: {roles.join(", ")}
          </p>
        </div>
      )
    }
  }

  return <>{children}</>
}

"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/hooks/redux"
import { UserType } from "@/types/auth"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserType
  redirectTo?: string
}

export default function ProtectedRoute({ children, requiredRole, redirectTo }: ProtectedRouteProps) {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth)
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    console.log("ProtectedRoute - Auth state:", {
      isAuthenticated,
      isLoading,
      user: user
        ? {
            id: user.id,
            userType: user.userType,
            email: user.email,
          }
        : null,
      requiredRole,
    })

    // Still loading authentication state
    if (isLoading) {
      setIsAuthorized(null)
      return
    }

    // Not authenticated
    if (!isAuthenticated || !user) {
      console.log("ProtectedRoute - User not authenticated, redirecting to login")
      router.push("/login")
      setIsAuthorized(false)
      return
    }

    // No specific role required, just need to be authenticated
    if (!requiredRole) {
      setIsAuthorized(true)
      return
    }

    // Check if user has required role
    const hasRequiredRole = user.userType === requiredRole
    console.log("ProtectedRoute - Role check:", {
      userType: user.userType,
      requiredRole,
      hasRequiredRole,
    })

    if (!hasRequiredRole) {
      console.log("ProtectedRoute - User does not have required role")

      // Redirect based on user type if no custom redirect specified
      if (!redirectTo) {
        switch (user.userType) {
          case UserType.Admin:
            router.push("/admin")
            break
          case UserType.VenueUsers:
            router.push("/venue-owner")
            break
          case UserType.NormalUsers:
            router.push("/dashboard")
            break
          default:
            router.push("/login")
        }
      } else {
        router.push(redirectTo)
      }

      setIsAuthorized(false)
      return
    }

    setIsAuthorized(true)
  }, [isAuthenticated, isLoading, user, requiredRole, router, redirectTo])

  // Show loading while checking authentication
  if (isLoading || isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Show unauthorized message if user doesn't have access
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized</h1>
          <p className="text-gray-600 mb-4">You do not have permission to access this page.</p>
          {user && (
            <div className="text-sm text-gray-500">
              <p>Your role: {user.userType}</p>
              <p>Required role: {requiredRole}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return <>{children}</>
}

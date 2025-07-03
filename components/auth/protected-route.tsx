"use client"

import type React from "react"
import { useEffect, useState } from "react"
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
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    console.log("ProtectedRoute - Auth state:", {
      isAuthenticated,
      loading,
      user: user
        ? {
            id: user.id,
            userType: user.userType,
            email: user.email,
          }
        : null,
      requiredRole,
    })

    // Wait for auth to finish loading
    if (loading) {
      return
    }

    setIsChecking(false)

    // Not authenticated - redirect to login
    if (!isAuthenticated || !user) {
      console.log("ProtectedRoute - User not authenticated, redirecting to login")
      router.replace("/login")
      return
    }

    // No specific role required - user just needs to be authenticated
    if (!requiredRole) {
      return
    }

    // Check if user has required role
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    const hasRequiredRole = roles.includes(user.userType)

    console.log("ProtectedRoute - Role check:", {
      userType: user.userType,
      requiredRoles: roles,
      hasRequiredRole,
    })

    if (!hasRequiredRole) {
      console.log("ProtectedRoute - User does not have required role, redirecting...")

      // Redirect based on user type
      switch (user.userType) {
        case UserType.Admin:
          router.replace("/admin")
          break
        case UserType.VenueUsers:
          router.replace("/venue-owner")
          break
        case UserType.SuperUsers:
          window.location.href = "http://localhost:8000/admin"
          break
        default:
          router.replace("/dashboard")
      }
    }
  }, [isAuthenticated, loading, user, requiredRole, router])

  // Show loading while checking authentication
  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // Check role authorization
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    if (!roles.includes(user.userType)) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-red-500">
          <h2 className="text-2xl font-bold mb-2">Unauthorized</h2>
          <p className="mb-4">You do not have permission to access this page.</p>
          <div className="text-sm text-gray-500 text-center">
            <p>
              Your role: <span className="font-mono">{user.userType}</span>
            </p>
            <p>
              Required role(s): <span className="font-mono">{roles.join(", ")}</span>
            </p>
          </div>
        </div>
      )
    }
  }

  return <>{children}</>
}

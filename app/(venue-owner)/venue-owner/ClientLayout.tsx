"use client"

import type React from "react"

import { useEffect } from "react"
import { useAppDispatch } from "@/hooks/redux"
import ProtectedRoute from "@/components/auth/protected-route"
import { UserType } from "@/types/auth"

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Any client-side initialization can go here
    console.log("VenueOwner ClientLayout mounted")
  }, [dispatch])

  return <ProtectedRoute requiredRole={UserType.VenueUsers}>{children}</ProtectedRoute>
}

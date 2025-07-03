"use client"

import type React from "react"

import { useEffect } from "react"
import { useAppDispatch } from "@/hooks/redux"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserType } from "@/types/auth"
import { Sidebar } from "@/components/venue-owner/sidebar"
import { Header } from "@/components/venue-owner/header"

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Initialize any venue owner specific data here
    console.log("ClientLayout mounted for venue owner")
  }, [dispatch])

  return (
    <ProtectedRoute requiredRole={UserType.VenueUsers}>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

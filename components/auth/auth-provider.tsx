"use client"

import type React from "react"

import { useAuthInit } from "@/hooks/use-auth-init"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useAuthInit()
  return <>{children}</>
}

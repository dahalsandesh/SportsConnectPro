import type React from "react"
import { MainHeader } from "@/components/layout/main-header"
import { MainFooter } from "@/components/layout/main-footer"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <MainHeader />
      <main className="flex-1">{children}</main>
      <MainFooter />
    </>
  )
}

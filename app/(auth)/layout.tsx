import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication pages for SportConnect Pro",
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <main className="flex min-h-screen flex-col">{children}</main>
      </ThemeProvider>
    </div>
  )
}

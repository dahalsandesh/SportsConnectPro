import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Montserrat } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { ReduxProvider } from "@/redux/provider"
import { NotificationProvider } from "@/components/notification-provider"
import { MainHeader } from "@/components/layout/main-header"
import { MainFooter } from "@/components/layout/main-footer"
import { cn } from "@/lib/utils"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    template: "%s | SportConnect Pro",
    default: "SportConnect Pro - Book Sports Venues Online",
  },
  description: "Find and book sports venues near you. Easy booking, instant confirmation.",
  keywords: ["sports", "booking", "futsal", "tennis", "basketball", "venues", "courts"],
  authors: [{ name: "SportConnect Pro Team" }],
  creator: "SportConnect Pro",
  publisher: "SportConnect Pro",
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable, montserrat.variable)}>
        <ReduxProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <NotificationProvider>
              <div className="flex min-h-screen flex-col">
                <MainHeader />
                <main className="flex-1">{children}</main>
                <MainFooter />
              </div>
              <Toaster />
            </NotificationProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}

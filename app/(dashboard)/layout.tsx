import type { Metadata } from "next"
import { ClientLayout } from "./ClientLayout"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your bookings and account",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}

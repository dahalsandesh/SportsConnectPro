import type { Metadata } from "next"
import { Suspense } from "react"
import dynamic from 'next/dynamic'

// Import the client component with SSR disabled
const ClientPage = dynamic(
  () => import('@/components/admin/dashboard/client-page'),
  { 
    loading: () => (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-9 w-64 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-36 bg-muted rounded-lg animate-pulse"></div>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-[400px] bg-muted rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }
)

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage your sports booking platform",
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={
      <div className="space-y-6 p-6">
        <div className="h-9 w-64 bg-muted rounded animate-pulse"></div>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-36 bg-muted rounded-lg animate-pulse"></div>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-[400px] bg-muted rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    }>
      <ClientPage />
    </Suspense>
  )
}

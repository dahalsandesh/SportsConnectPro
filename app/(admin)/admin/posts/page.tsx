import { Suspense } from "react"
import type { Metadata } from "next"
import { Skeleton } from "@/components/ui/skeleton"
import { PostsManagement } from "@/components/admin/posts/posts-management"

export const metadata: Metadata = {
  title: "Posts | Admin",
  description: "Manage posts and news articles",
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="rounded-md border">
        <Skeleton className="h-12 w-full" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full border-t" />
        ))}
      </div>
    </div>
  )
}

export default function PostsPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<LoadingSkeleton />}>
        <PostsManagement />
      </Suspense>
    </div>
  )
}

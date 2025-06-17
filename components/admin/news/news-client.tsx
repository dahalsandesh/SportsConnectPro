'use client'

import * as React from 'react'
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { useNewsColumns } from "./columns"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetAdminPostsQuery } from "@/redux/api/admin/postsApi"

type NewsItem = {
  id: string
  title: string
  category: string
  date: string
  time: string
  postImage: string
  description: string
}

export const NewsClient = () => {
  const router = useRouter()
  const { toast } = useToast()
  const { data: news = [], isLoading, error } = useGetAdminPostsQuery()
  const columns = useNewsColumns()

  React.useEffect(() => {
    if (error) {
      console.error('Error fetching news:', error)
      toast({
        title: "Error",
        description: "Failed to fetch news",
        variant: "destructive"
      })
    }
  }, [error, toast])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">News & Media</h2>
          <p className="text-sm text-muted-foreground">
            Manage your news posts and media
          </p>
        </div>
        <Button onClick={() => router.push('/admin/news/new')}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <DataTable
        searchKey="title"
        columns={columns}
        data={news}
      />
    </div>
  )
}

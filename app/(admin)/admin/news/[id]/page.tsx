'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { NewsForm } from '@/components/admin/news/news-form'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'

export default function NewsDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [news, setNews] = useState<any>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/admin/news/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch news')
        }
        const data = await response.json()
        setNews(data)
      } catch (error) {
        console.error('Error fetching news:', error)
        toast({ title: 'Failed to load news', variant: 'destructive' })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchNews()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!news) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h3 className="text-lg font-medium">News not found</h3>
        <p className="text-sm text-muted-foreground">
          The news you are looking for does not exist.
        </p>
        <Button 
          className="mt-4" 
          onClick={() => router.push('/admin/news')}
        >
          Back to News
        </Button>
      </div>
    )
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Edit News</h2>
        </div>
        <NewsForm initialData={news} />
      </div>
    </div>
  )
}

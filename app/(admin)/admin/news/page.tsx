import { NewsClient } from "@/components/admin/news/news-client"

export default function NewsPage() {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <NewsClient />
      </div>
    </div>
  )
}

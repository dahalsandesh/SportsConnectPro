import { NewsForm } from "@/components/admin/news/news-form"

export default function NewNewsPage() {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <h2 className="text-2xl font-bold tracking-tight">Create New News</h2>
        <NewsForm />
      </div>
    </div>
  )
}

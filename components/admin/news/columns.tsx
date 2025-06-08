'use client'

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"

export type NewsColumn = {
  id: string
  title: string
  description: string
  category: string
  date: string
  time: string
  postImage: string
}

export function useNewsColumns() {
  const { toast } = useToast()

  const columns: ColumnDef<NewsColumn>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.original.date)
        return format(date, 'PPP')
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const news = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(news.id)}
              >
                Copy news ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => window.open(`/admin/news/${news.id}`, '_blank')}
              >
                View details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => window.open(`/admin/news/${news.id}`)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  try {
                    const response = await fetch(`/api/admin/news/${news.id}`, {
                      method: 'DELETE',
                    })
                    
                    if (!response.ok) {
                      throw new Error('Failed to delete news')
                    }
                    
                    toast({
                      title: "Success",
                      description: "News deleted successfully",
                    })
                    window.location.reload()
                  } catch (error) {
                    console.error('Error deleting news:', error)
                    toast({
                      title: "Error",
                      description: "Something went wrong",
                      variant: "destructive",
                    })
                  }
                }}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return columns
}

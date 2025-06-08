import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react"

export type Booking = {
  id: string
  userName: string
  venueName: string
  courtName: string
  bookingDate: string
  date: string
  startTime: string
  endTime: string
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "REJECTED"
  totalAmount: number
  paymentStatus: "PENDING" | "PAID" | "REFUNDED" | "FAILED"
  createdAt: string
  updatedAt: string
}

type CellProps<T> = {
  row: {
    getValue: (key: string) => T
    original: Booking
  }
}

export const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: "id",
    header: "Booking ID",
    cell: ({ row }) => `#${row.original.id.substring(0, 8)}`
  },
  {
    accessorKey: "userName",
    header: "User"
  },
  {
    accessorKey: "venueName",
    header: "Venue"
  },
  {
    accessorKey: "courtName",
    header: "Court"
  },
  {
    accessorKey: "bookingDate",
    header: "Date",
    cell: ({ row }) => format(new Date(row.original.bookingDate), 'MMM dd, yyyy')
  },
  {
    id: "timeSlot",
    header: "Time Slot",
    cell: ({ row }) => `${row.original.startTime} - ${row.original.endTime}`
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      const statusMap = {
        PENDING: { label: "Pending", variant: "outline" },
        CONFIRMED: { label: "Confirmed", variant: "default" },
        CANCELLED: { label: "Cancelled", variant: "destructive" },
        COMPLETED: { label: "Completed", variant: "secondary" },
        REJECTED: { label: "Rejected", variant: "destructive" }
      }
      return <Badge variant={statusMap[status]?.variant as any}>{statusMap[status]?.label}</Badge>
    }
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => {
      const status = row.original.paymentStatus
      const statusMap = {
        PENDING: { label: "Pending", variant: "outline" },
        PAID: { label: "Paid", variant: "default" },
        REFUNDED: { label: "Refunded", variant: "secondary" },
        FAILED: { label: "Failed", variant: "destructive" }
      }
      return <Badge variant={statusMap[status]?.variant as any}>{statusMap[status]?.label}</Badge>
    }
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.original.totalAmount.toString())
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
    }
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <Eye className="h-4 w-4" />
          <span className="sr-only">View</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    )
  }
]

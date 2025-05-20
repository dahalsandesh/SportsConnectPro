"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, CheckCircle, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { VenueApplicationResponse } from "@/types/admin"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { format } from "date-fns"

interface ApplicationsTableProps {
  applications: VenueApplicationResponse[]
  isLoading: boolean
  searchQuery: string
  filter: "all" | "pending" | "approved" | "rejected"
}

export function ApplicationsTable({ applications, isLoading, searchQuery, filter }: ApplicationsTableProps) {
  const { toast } = useToast()

  // Filter applications based on searchQuery and filter
  const filteredApplications = applications.filter((application) => {
    // Filter by status
    if (filter === "pending" && application.Status !== "pending") {
      return false
    }
    if (filter === "approved" && application.Status !== "approved") {
      return false
    }
    if (filter === "rejected" && application.Status !== "rejected") {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        application.VenueName.toLowerCase().includes(query) ||
        application.Address.toLowerCase().includes(query) ||
        application.PhoneNumber.includes(query) ||
        application.Email.toLowerCase().includes(query)
      )
    }

    return true
  })

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-8" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Venue Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredApplications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No applications found.
              </TableCell>
            </TableRow>
          ) : (
            filteredApplications.map((application) => (
              <TableRow key={application.ID}>
                <TableCell className="font-medium">{application.ID.substring(0, 8)}...</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{application.VenueName}</span>
                    <span className="text-xs text-muted-foreground">{application.Address}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{application.Email}</span>
                    <span className="text-xs text-muted-foreground">{application.PhoneNumber}</span>
                  </div>
                </TableCell>
                <TableCell>{format(new Date(application.CreatedAt), "MMM dd, yyyy")}</TableCell>
                <TableCell>{getStatusBadge(application.Status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/venue-applications/${application.ID}`}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {application.Status === "pending" && (
                        <>
                          <DropdownMenuItem className="text-green-600">
                            <CheckCircle className="mr-2 h-4 w-4" /> Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <X className="mr-2 h-4 w-4" /> Reject
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

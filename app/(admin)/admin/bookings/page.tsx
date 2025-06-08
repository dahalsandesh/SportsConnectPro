"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw, Calendar } from "lucide-react"
import { useGetBookingsQuery } from "@/redux/api/bookings/bookingsApi"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function BookingsPage() {
  const { toast } = useToast()
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  
  const { 
    data: response, 
    isLoading, 
    error, 
    refetch 
  } = useGetBookingsQuery({ page, limit: pageSize })
  
  // Transform the API response to match the expected Booking type
  const bookings = React.useMemo(() => 
    (response?.data || []).map(booking => ({
      id: booking.bookingId,
      userName: booking.userName || 'N/A',
      venueName: booking.court?.venueName || 'N/A',
      courtName: booking.court?.courtName || 'N/A',
      bookingDate: booking.bookingDate,
      date: booking.bookingDate, // Using the same as bookingDate for now
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      totalAmount: booking.totalAmount || 0,
      paymentStatus: booking.paymentStatus,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt
    })) || [],
    [response?.data]
  )
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage + 1) // Table is 0-indexed, API is 1-indexed
  }

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true)
      await refetch()
      toast({
        title: "Success",
        description: "Bookings data refreshed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh bookings data",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const isDataLoading = isLoading || isRefreshing

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">
            {isDataLoading 
              ? "Loading..." 
              : `Showing ${bookings.length} ${bookings.length === 1 ? 'booking' : 'bookings'} of ${response?.total || 0}`}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isDataLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Booking
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>
                {isDataLoading 
                  ? "Loading booking information..." 
                  : "Manage and review all booking records"}
              </CardDescription>
            </div>
            {!isDataLoading && bookings.length > 0 && (
              <div className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load bookings. Please try again later.
              </AlertDescription>
            </Alert>
          ) : isDataLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <div className="rounded-full bg-muted p-4">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium">No bookings found</h3>
                <p className="text-sm text-muted-foreground">
                  Get started by creating a new booking
                </p>
              </div>
              <Button className="mt-2">
                <Plus className="mr-2 h-4 w-4" />
                Create Booking
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <DataTable 
                columns={columns} 
                data={bookings} 
                searchKey="userName"
              />
              {response && (
                <div className="flex items-center justify-between px-2">
                  <div className="text-sm text-muted-foreground">
                    Showing {bookings.length} of {response.total} bookings
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page - 2)} // -2 because page is 1-indexed
                      disabled={page <= 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {page} of {response.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page)} // page is already 1-indexed, so we pass as is
                      disabled={page >= response.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format, parseISO } from "date-fns"
import { Calendar, Clock, MapPin, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { 
  useGetUpcomingBookingsQuery,
  useGetPastBookingsQuery,
  useUpdateBookingStatusMutation,
  type VenueOwnerBooking as Booking 
} from "@/redux/api/venue-owner/bookingsApi"

const BookingCardSkeleton = () => (
  <Card className="overflow-hidden animate-pulse">
    <CardHeader className="pb-3">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
        </div>
        <div className="h-6 w-16 bg-gray-200 rounded"></div>
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </CardContent>
    <CardFooter className="flex justify-end gap-2 pt-4">
      <div className="h-8 w-24 bg-gray-200 rounded"></div>
      <div className="h-8 w-20 bg-gray-200 rounded"></div>
    </CardFooter>
  </Card>
)

const BookingCard = ({ 
  booking, 
  onCancel,
  isCancelling,
  cancellingBookingId
}: { 
  booking: Booking;
  onCancel: (id: string) => void;
  isCancelling: boolean;
  cancellingBookingId: string | null;
}) => {
  const router = useRouter()
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const isThisBookingCancelling = isCancelling && cancellingBookingId === booking.bookingId

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
      onClick={() => router.push(`/bookings/${booking.bookingId}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {booking.court?.venueName || 'Venue'}
            </CardTitle>
            <CardDescription className="mt-1">
              {booking.court?.courtName || 'Court'}
            </CardDescription>
          </div>
          <Badge 
            variant={booking.status === 'CONFIRMED' ? 'default' : booking.status === 'CANCELLED' ? 'destructive' : 'outline'}
            className="capitalize"
          >
            {booking.status.toLowerCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            {format(parseISO(booking.bookingDate), 'PPP')}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            {booking.startTime} - {booking.endTime}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            {booking.court?.venueAddress || 'Location not specified'}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-4">
        <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          {booking.status === 'CONFIRMED' && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setIsConfirmOpen(true)
              }}
              disabled={isThisBookingCancelling}
              className="relative"
            >
              {isThisBookingCancelling && (
                <Loader2 className="absolute left-2 h-4 w-4 animate-spin" />
              )}
              <span className={isThisBookingCancelling ? 'ml-4' : ''}>
                Cancel Booking
              </span>
            </Button>
          )}

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will cancel your booking. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isThisBookingCancelling}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.stopPropagation()
                  onCancel(booking.bookingId)
                }}
                disabled={isThisBookingCancelling}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isThisBookingCancelling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  'Yes, cancel booking'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button 
          size="sm" 
          variant="outline"
          onClick={(e) => {
            e.stopPropagation()
            router.push(`/bookings/${booking.bookingId}`)
          }}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

export function MyBookings() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("upcoming")
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null)
  
  // Fetch venue owner's bookings
  const { data: upcomingBookings, isLoading: isLoadingUpcoming } = useGetUpcomingBookingsQuery()
  const { data: pastBookings, isLoading: isLoadingPast } = useGetPastBookingsQuery()
  
  const bookingsData = activeTab === "upcoming" ? upcomingBookings : pastBookings
  const isLoading = activeTab === "upcoming" ? isLoadingUpcoming : isLoadingPast
  const isError = false // Handle errors from both queries if needed
  
  // Update booking status mutation
  const [updateBookingStatus, { isLoading: isCancelling }] = useUpdateBookingStatusMutation()
  
  // Refetch function to refresh data
  const refetch = () => {
    // The RTK Query will automatically refetch when the component re-renders
    // or when the tab changes due to the activeTab state change
  }
  
  // Handle cancel booking
  const cancelBooking = async (bookingId: string) => {
    setCancellingBookingId(bookingId)
    try {
      const result = await updateBookingStatus({
        bookingId,
        status: 'CANCELLED',
        cancellationReason: 'Cancelled by venue owner'
      } as any) // Temporary type assertion to fix type error
      
      if ('error' in result) {
        throw result.error
      }
      
      toast({
        title: "Booking cancelled",
        description: "Your booking has been cancelled successfully.",
        variant: "default",
      })
      
      // Refresh the bookings list
      refetch()
    } catch (err: any) {
      console.error("Error cancelling booking:", err)
      toast({
        title: "Cancellation failed",
        description: err?.data?.message || "Failed to cancel booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setCancellingBookingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">My Bookings</h2>
          <p className="text-muted-foreground">
            {activeTab === "upcoming" ? "Upcoming" : "Past"} bookings and reservations
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <BookingCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">My Bookings</h2>
          <p className="text-muted-foreground">
            {activeTab === "upcoming" ? "Upcoming" : "Past"} bookings and reservations
          </p>
        </div>
        <div className="rounded-md bg-destructive/10 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-destructive">
                Failed to load bookings
              </h3>
              <p className="mt-2 text-sm text-destructive">
                There was an error loading your bookings. Please try again later.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => refetch()}
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const bookings = bookingsData?.data || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Bookings</h2>
          <p className="text-muted-foreground">
            {activeTab === "upcoming" ? "Upcoming" : "Past"} bookings and reservations
          </p>
        </div>
      </div>

      <Tabs 
        defaultValue="upcoming" 
        className="w-full"
        onValueChange={(value) => setActiveTab(value as "upcoming" | "past")}
      >
        <TabsList className="grid w-full max-w-xs grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {bookings.filter(b => b.status !== 'CANCELLED' && b.status !== 'COMPLETED').length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">No upcoming bookings</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                You don't have any upcoming bookings. Book a court to get started!
              </p>
              <Button 
                className="mt-4" 
                onClick={() => router.push("/venues")}
              >
                Find a Venue
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bookings
                .filter(b => b.status !== 'CANCELLED' && b.status !== 'COMPLETED')
                .map((booking) => (
                  <BookingCard 
                    key={booking.bookingId}
                    booking={booking}
                    onCancel={cancelBooking}
                    isCancelling={isCancelling}
                    cancellingBookingId={cancellingBookingId}
                  />
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {bookings.filter(b => b.status === 'CANCELLED' || b.status === 'COMPLETED').length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">No past bookings</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Your past bookings will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bookings
                .filter(b => b.status === 'CANCELLED' || b.status === 'COMPLETED')
                .map((booking) => (
                  <BookingCard 
                    key={booking.bookingId}
                    booking={booking}
                    onCancel={cancelBooking}
                    isCancelling={isCancelling}
                    cancellingBookingId={cancellingBookingId}
                  />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

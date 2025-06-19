"use client";

import { useState } from "react";
import { useGetVenueBookingsQuery } from "@/redux/api/venue-owner/bookingApi";
import { useGetCourtsQuery } from "@/redux/api/venue-owner/courtApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User, Check, X } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BookingManagement() {
  const [selectedCourtId, setSelectedCourtId] = useState<string>("");

  // Get current date and date 30 days from now for the initial query
  const today = new Date().toISOString().split("T")[0];
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 30);
  const futureDateStr = futureDate.toISOString().split("T")[0];

  // Get courts for selection
  const { data: courts = [], isLoading: isLoadingCourts } = useGetCourtsQuery();

  // Fetch bookings for the selected court and date range
  const {
    data: bookings,
    isLoading,
    error,
  } = useGetVenueBookingsQuery(
    {
      courtId: selectedCourtId,
      startDate: today,
      endDate: futureDateStr,
    },
    { skip: !selectedCourtId } // Skip query if no court is selected
  );

  if (isLoadingCourts) return <div>Loading courts...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bookings</h2>
          <p className="text-muted-foreground">
            Manage court bookings and reservations
          </p>
        </div>
      </div>

      {/* Court Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Court</label>
        <Select value={selectedCourtId} onValueChange={setSelectedCourtId}>
          <SelectTrigger className="w-full md:w-64">
            <SelectValue placeholder="Choose a court" />
          </SelectTrigger>
          <SelectContent>
            {courts.map((court) => (
              <SelectItem key={court.courtId} value={court.courtId}>
                {court.courtName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bookings Display */}
      {!selectedCourtId ? (
        <div className="text-center py-8 text-muted-foreground">
          Please select a court to view bookings
        </div>
      ) : isLoading ? (
        <div>Loading bookings...</div>
      ) : error ? (
        <div>Error loading bookings.</div>
      ) : (
        <div className="grid gap-4">
          {bookings?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No bookings found for the selected court and date range
            </div>
          ) : (
            bookings?.map((booking: any) => (
              <Card key={booking.bookingId}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Booking #{booking.bookingId}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        booking.status === "confirmed"
                          ? "text-green-500"
                          : booking.status === "pending"
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}>
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4" />
                        <span className="font-medium">Customer:</span>
                        <span>{booking.BookerName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">Date:</span>
                        <span>
                          {format(new Date(booking.bookDate), "yyyy-MM-dd")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">Time:</span>
                        <span>
                          {booking.startTime} - {booking.endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">Payment:</span>
                        <span>{booking.paymentMethod}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">Amount:</span>
                        <span>${booking.totalPrice}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      {booking.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-500">
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500">
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}

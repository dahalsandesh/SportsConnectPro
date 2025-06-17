"use client";

import { useState } from "react";
import { useGetVenueBookingsQuery } from "@/redux/api/user/bookingsApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User, Check, X } from "lucide-react";
import { format } from "date-fns";

export default function BookingManagement() {
  const { data: bookings, isLoading, error } = useGetVenueBookingsQuery();

  if (isLoading) return <div>Loading bookings...</div>;
  if (error) return <div>Error loading bookings.</div>;

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

      <div className="grid gap-4">
        {bookings?.map((booking: any) => (
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
                    <span>{booking.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Date:</span>
                    <span>
                      {format(new Date(booking.bookingDate), "yyyy-MM-dd")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">Time:</span>
                    <span>
                      {booking.startTime} - {booking.endTime}
                    </span>
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
        ))}
      </div>
    </div>
  );
}

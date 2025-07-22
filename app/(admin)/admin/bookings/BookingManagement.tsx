"use client";

import { useState } from "react";
import { useGetBookingsByDateQuery } from "@/redux/api/admin/bookingsApi";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";

function getAuthToken() {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        return parsed.token;
      } catch {
        return "";
      }
    }
  }
  return "";
}

function formatTimeSlot(slot: string) {
  if (!slot) return "";
  const [start, end] = slot.split(" - ");
  const formatPart = (t: string) => {
    const [h, m] = t.split(":");
    const date = new Date();
    date.setHours(Number(h), Number(m), 0, 0);
    return format(date, "hh:mm a");
  };
  return `${formatPart(start)} - ${formatPart(end)}`;
}

export default function BookingManagement() {
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  const { data: bookings = [], isLoading, error } = useGetBookingsByDateQuery({ date: formattedDate });

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-1">All Bookings</h2>
          <p className="text-muted-foreground">View all venue bookings for a selected date</p>
        </div>
      </div>
      <div className="flex gap-4 items-end">
        <div>
          <label className="text-sm font-medium mb-1 block">Select Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={date => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="mt-6">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground text-lg">Loading bookings...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500 text-lg">Error loading bookings.</div>
        ) : bookings.length === 0 ? (
          <div className="text-center text-muted-foreground text-lg">No bookings found for this date</div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking: any) => (
              <div key={booking.bookingId} className="shadow-lg border-2 border-muted rounded-xl p-5 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:border-primary transition">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-lg mb-1">{booking.BookerName}</div>
                  <div className="text-xs text-muted-foreground mb-1">{booking.venueName} &ndash; {booking.coutName}</div>
                  <div className="text-xs text-muted-foreground mb-1">{format(new Date(booking.bookDate), "PPP")} | {formatTimeSlot(booking.timeSlot)}</div>
                  <div className="text-sm mt-1"><span className="font-medium">Payment:</span> {booking.paymentMethod}</div>
                  <div className="text-sm"><span className="font-medium">Total Price:</span> {booking.totalPrice ?? 'N/A'}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold self-start md:self-center ${
                  booking.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : booking.status === "Success"
                    ? "bg-green-100 text-green-800"
                    : booking.status === "Rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

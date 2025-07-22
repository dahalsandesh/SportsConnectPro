"use client";

import { useState, useEffect } from "react";
import {
  useGetVenueBookingsQuery,
  useUpdateVenueBookingStatusMutation,
  useGetVenueBookingByIdQuery
} from "@/redux/api/venue-owner/bookingApi";
import { useGetCourtsQuery } from "@/redux/api/venue-owner/courtApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";

// Helper to get token (from localStorage or fallback to hardcoded)
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        return parsed.token 
      } catch {
        return "d174c61bef554459ec7a8420dca80810d1deda2c";
      }
    }
  }

};

function formatTime(t: string) {
  if (!t) return "";
  // Handles '08:00:00.000000' or '08:00:00'
  const [h, m] = t.split(":");
  const date = new Date();
  date.setHours(Number(h), Number(m), 0, 0);
  return format(date, "hh:mm a");
}

function formatTimeRange(start: string, end: string) {
  if (!start || !end) return "";
  return `${formatTime(start)} - ${formatTime(end)}`;
}

export default function BookingManagement() {
  const [selectedCourtId, setSelectedCourtId] = useState<string>("");
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>(() => {
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + 30);
    return { start: today, end: future };
  });
  const [showDetailsId, setShowDetailsId] = useState<string | null>(null);
  const token = getAuthToken();

  // Fetch courts
  const { data: courts = [], isLoading: isLoadingCourts } = useGetCourtsQuery();

  // Fetch bookings for selected court and date range
  const {
    data: bookings = [],
    isLoading: isLoadingBookings,
    error: bookingsError,
  } = useGetVenueBookingsQuery(
    selectedCourtId
      ? {
          courtId: selectedCourtId,
          startDate: format(dateRange.start, "yyyy-MM-dd"),
          endDate: format(dateRange.end, "yyyy-MM-dd"),
          token,
        }
      : ({} as any),
    { skip: !selectedCourtId }
  );

  // Booking details (on demand)
  const { data: bookingDetails } = useGetVenueBookingByIdQuery(
    showDetailsId ? { bookingId: showDetailsId, token } : ({} as any),
    { skip: !showDetailsId }
  );

  // Status update mutation
  const [updateStatus, { isLoading: isUpdating }] = useUpdateVenueBookingStatusMutation();

  // Handle status update
  const handleStatusUpdate = async (
    bookingId: string,
    statusId: string // should be actual statusId from status master
  ) => {
    try {
      await updateStatus({ bookingId, statusId, token }).unwrap();
      toast.success(`Booking status updated`);
    } catch (error) {
      toast.error("Failed to update booking status");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-1">Bookings</h2>
          <p className="text-muted-foreground">Manage court bookings and reservations</p>
        </div>
      </div>

      {/* Court Selection */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full md:w-64">
          <label className="text-sm font-medium mb-1 block">Select Court</label>
          <Select value={selectedCourtId} onValueChange={setSelectedCourtId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a court" />
            </SelectTrigger>
            <SelectContent>
              {courts.map((court: any) => (
                <SelectItem key={court.courtId} value={court.courtId}>
                  {court.courtName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Date Range Picker */}
        <div className="flex gap-2 items-end">
          <div>
            <label className="text-sm font-medium mb-1 block">Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[180px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  {dateRange.start ? format(dateRange.start, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0">
                <Calendar
                  mode="single"
                  selected={dateRange.start}
                  onSelect={date => setDateRange(r => ({ ...r, start: date || r.start }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">End Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[180px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  {dateRange.end ? format(dateRange.end, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0">
                <Calendar
                  mode="single"
                  selected={dateRange.end}
                  onSelect={date => setDateRange(r => ({ ...r, end: date || r.end }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Bookings Display */}
      <div className="mt-6">
        {!selectedCourtId ? (
          <div className="text-center py-8 text-muted-foreground text-lg">
            Please select a court to view bookings
          </div>
        ) : isLoadingBookings ? (
          <div className="text-center py-8 text-muted-foreground text-lg">Loading bookings...</div>
        ) : bookingsError ? (
          <div className="text-center py-8 text-red-500 text-lg">Error loading bookings.</div>
        ) : (
          <div className="grid gap-6">
            {bookings.length === 0 ? (
              <div className="text-center text-muted-foreground text-lg">
                No bookings found for selected court and date range
              </div>
            ) : (
              bookings.map((booking: any) => (
                <Card key={booking.bookingId} className="shadow-lg border-2 border-muted hover:border-primary transition">
                  <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                    <div>
                      <CardTitle className="text-lg font-semibold">{booking.BookerName}</CardTitle>
                      <div className="text-muted-foreground text-xs">
  {format(new Date(booking.bookDate), "PPP")} |
  {(() => {
    if (!booking.timeSlot) return "";
    const [startRaw, endRaw] = booking.timeSlot.split(" - ");
    const start = startRaw?.split(".")[0];
    const end = endRaw?.split(".")[0];
    return formatTimeRange(start, end);
  })()}
</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : booking.status === "Confirmed"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {booking.status}
                    </span>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
                    <div className="flex flex-col gap-1">
                      <div className="text-sm"><span className="font-medium">Payment:</span> {booking.paymentMethod}</div>
                      <div className="text-sm"><span className="font-medium">Total Price:</span> {booking.totalPrice ?? 'N/A'}</div>
                    </div>
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <Button size="sm" variant="outline" onClick={() => setShowDetailsId(booking.bookingId)}>
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(booking.bookingId, "607322af-7d0d-436f-843f-a50488951432")}
                        disabled={isUpdating}
                        variant="secondary"
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(booking.bookingId, "d563462a-b38c-4058-b4b4-9a350511ebd2")}
                        disabled={isUpdating}
                        variant="destructive"
                      >
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {showDetailsId && bookingDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-in fade-in-0 zoom-in-95">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              onClick={() => setShowDetailsId(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4">Booking Details</h3>
            <div className="space-y-3">
              <div><span className="font-medium">Booker:</span> {bookingDetails.BookerName}</div>
              <div><span className="font-medium">Status:</span> <span className={`px-2 py-1 rounded text-xs font-semibold ${
                bookingDetails.status === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : bookingDetails.status === "Confirmed"
                  ? "bg-green-100 text-green-800"
                  : bookingDetails.status === "Rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}>{bookingDetails.status}</span></div>
              <div><span className="font-medium">Payment:</span> {bookingDetails.paymentMethod}</div>
              <div><span className="font-medium">Date:</span> {bookingDetails.bookDate && format(new Date(bookingDetails.bookDate), "PPP")}</div>
              <div><span className="font-medium">Time:</span> {formatTimeRange(bookingDetails.startTime, bookingDetails.endTime)}</div>
              <div><span className="font-medium">Total Price:</span> {bookingDetails.totalPrice ?? 'N/A'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

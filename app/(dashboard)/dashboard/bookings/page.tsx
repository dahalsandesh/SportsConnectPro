'use client';

import { useState, useCallback } from 'react';
import { useGetBookingsQuery } from '@/redux/api/user/userApi';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

export default function BookingsPage() {
  const { user } = useAuth();
  const { data: bookings = [], isLoading, error } = useGetBookingsQuery({ userId: user?.userId || '' });
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openBookingDetails = useCallback((booking: any) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  }, []);

  const formatTimeSlot = useCallback((ticket: string, dateString?: string) => {
    try {
      const [start, end] = ticket.split(' - ');
      const formatTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return new Date(0, 0, 0, hours, minutes).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        });
      };
      
      const formattedTime = `${formatTime(start)} - ${formatTime(end)}`;
      
      if (dateString) {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
        return `${formattedDate} • ${formattedTime}`;
      }
      
      return formattedTime;
    } catch (e) {
      return ticket;
    }
  }, []);

  // Status variant function
  const getStatusVariant = useCallback((status: string) => {
    return status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
           status === 'Success' ? 'bg-green-100 text-green-800' : 
           'bg-red-100 text-red-800';
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive">
            Error loading bookings. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Bookings</h1>
      </div>

      {bookings?.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">You don't have any bookings yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings?.map((booking: any) => {
            const timeSlot = formatTimeSlot(booking.ticket);
            const shortId = booking.bookingId?.split('-')[0] || 'N/A';
            
            return (
              <Card key={booking.bookingId} className="overflow-hidden">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg font-medium">
                        {booking.userName || 'Guest'}
                      </CardTitle>
                      <Badge variant="outline" className={getStatusVariant(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Booking ID: {shortId}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(booking.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      Rs. {booking.price?.toLocaleString() || '0'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {timeSlot}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openBookingDetails(booking)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Booking Details Modal */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              {selectedBooking && (
                <>
                  <DialogHeader>
                    <DialogTitle>Booking Details</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Booking ID:</span>
                        <span className="font-medium">{selectedBooking.bookingId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <Badge variant="outline" className={getStatusVariant(selectedBooking.status)}>
                          {selectedBooking.status}
                        </Badge>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Date:</span>
                        <span className="font-medium">
                          {new Date(selectedBooking.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Time Slot:</span>
                        <span className="font-medium">
                          {formatTimeSlot(selectedBooking.ticket)}
                        </span>
                      </div>
                      <div className="text-sm">
                      <p className="text-muted-foreground">
                        <span className="font-medium">Payment:</span> {selectedBooking.paymentMethod}
                      </p>
                    </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Amount:</span>
                        <span className="font-medium">Rs. {selectedBooking.price?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}

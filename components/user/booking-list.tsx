import { Booking } from '@/types/user-dashboard';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function BookingList({ bookings }: { bookings: Booking[] }) {
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
      case 'cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const formatBookingDate = (ticket: string) => {
    try {
      const [startTime, endTime] = ticket.split(' - ');
      if (!startTime || !endTime) return { date: 'N/A', time: ticket };
      
      // Handle different time formats (with or without seconds)
      const startTimeParts = startTime.split(':');
      const endTimeParts = endTime.split(':');
      
      if (startTimeParts.length < 2 || endTimeParts.length < 2) {
        return { date: 'N/A', time: ticket };
      }
      
      const startHours = parseInt(startTimeParts[0], 10);
      const startMinutes = parseInt(startTimeParts[1], 10);
      const endHours = parseInt(endTimeParts[0], 10);
      const endMinutes = endTimeParts[1] ? parseInt(endTimeParts[1], 10) : 0;
      
      const startDate = new Date();
      startDate.setHours(startHours, startMinutes, 0, 0);
      
      const endDate = new Date();
      endDate.setHours(endHours, endMinutes, 0, 0);
      
      return {
        date: format(startDate, 'MMM dd, yyyy'),
        time: `${format(startDate, 'h:mm a')} - ${format(endDate, 'h:mm a')}`
      };
    } catch (error) {
      console.error('Error formatting booking date:', error);
      return { date: 'N/A', time: ticket };
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No bookings found</p>
        <Button className="mt-4" asChild>
          <a href="/venues">Find Venues</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const { date, time } = formatBookingDate(booking.ticket);
        
        return (
          <Card key={booking.bookingId} className="overflow-hidden">
            <div className="md:flex">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{booking.venueName || 'Venue'}</h3>
                    <p className="text-sm text-muted-foreground">Booking ID: {booking.bookingId}</p>
                  </div>
                  <Badge variant={getStatusVariant(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p>{date}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Time</p>
                    <p>{time}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payment</p>
                    <p>{booking.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p>Rs. {booking.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t md:border-t-0 md:border-l p-4 flex items-center">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

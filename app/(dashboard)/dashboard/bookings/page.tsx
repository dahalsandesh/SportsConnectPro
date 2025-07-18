'use client';

import { useGetBookingsQuery } from '@/redux/api/user/userApi';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function BookingsPage() {
  const { user } = useAuth();
  const { data: bookings = [], isLoading, error } = useGetBookingsQuery({ userId: user?.userId || '' });

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
          {bookings?.map((booking: any) => (
            <Card key={booking.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  {booking.venue?.name || 'Venue'}
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(booking.bookingDate), 'PPP')} • {booking.startTime} - {booking.endTime}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Status: <span className="font-medium">{booking.status}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Court: {booking.court?.name || 'N/A'}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

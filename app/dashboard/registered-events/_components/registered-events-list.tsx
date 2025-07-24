'use client';

import { useGetRegisteredEventsQuery } from '@/redux/api/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface RegisteredEventsListProps {
  userId: string;
}

export function RegisteredEventsList({ userId }: RegisteredEventsListProps) {
  const { data, isLoading, isError, error } = useGetRegisteredEventsQuery(userId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    toast.error('Failed to load registered events');
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          Failed to load registered events. Please try again later.
        </p>
      </div>
    );
  }

  if (!data?.data?.length) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          You haven't registered for any events yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.data.map((event) => (
        <Card key={event.id} className="overflow-hidden">
          <div className="md:flex">
            {event.eventImage && (
              <div className="md:w-1/4">
                <img
                  src={event.eventImage}
                  alt={event.eventName}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{event.eventName}</CardTitle>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    event.status === 'registered' 
                      ? 'bg-blue-100 text-blue-800' 
                      : event.status === 'cancelled' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                  }`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(new Date(event.eventDate), 'PPP')}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    {format(new Date(event.eventDate), 'p')}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4" />
                    {event.eventLocation}
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Registered on {format(new Date(event.registeredAt), 'PPP')}
                  </p>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

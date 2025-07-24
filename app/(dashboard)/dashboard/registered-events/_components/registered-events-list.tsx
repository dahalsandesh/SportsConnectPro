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

  if (!data?.length) {
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
      {data.map((event, index) => (
        <Card key={`${event.coutName}-${index}`} className="overflow-hidden">
          <div className="md:flex">
            <div className="p-6 flex-1">
              <CardHeader className="p-0 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{event.eventName}</CardTitle>
                    <p className="text-sm text-muted-foreground">{event.coutName}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Registered
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0 space-y-2 mt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  {format(new Date(event.date), 'PPP')}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  {event.time.split(':').slice(0, 2).join(':')} {/* Format time to HH:MM */}
                </div>
                <div className="mt-2 pt-2 border-t">
                  <p className="text-sm text-muted-foreground">Booking Reference:</p>
                  <p className="font-mono text-sm">{event.token}</p>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

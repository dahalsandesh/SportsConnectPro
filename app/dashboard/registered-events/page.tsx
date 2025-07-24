import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { RegisteredEventsList } from './_components/registered-events-list';

export const metadata: Metadata = {
  title: 'My Registered Events',
  description: 'View and manage your registered events',
};

export default async function RegisteredEventsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login?callbackUrl=/dashboard/registered-events');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Registered Events</h1>
          <p className="text-muted-foreground">
            View and manage all your registered events in one place
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <RegisteredEventsList userId={session.user.id} />
      </div>
    </div>
  );
}

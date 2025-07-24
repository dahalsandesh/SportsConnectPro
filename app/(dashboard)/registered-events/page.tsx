'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RegisteredEventsList } from '@/app/dashboard/registered-events/_components/registered-events-list';

export default function RegisteredEventsPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUserId(user.userId);
        } catch (error) {
          console.error('Error parsing user data:', error);
          router.push('/login?callbackUrl=/dashboard/registered-events');
        }
      } else {
        router.push('/login?callbackUrl=/dashboard/registered-events');
      }
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userId) {
    return null; // Will redirect in useEffect
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
        <RegisteredEventsList userId={userId} />
      </div>
    </div>
  );
}

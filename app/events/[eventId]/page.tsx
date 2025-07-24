'use client';

import { useGetEventByIdQuery } from "@/redux/api/publicApi";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Trophy, Users, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { toast } from 'sonner';
import { RegisterButton } from "@/components/events/register-button";

interface EventDetail {
  eventId: string;
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  location?: string;
  maxSeat?: number;
  type?: string;
  sportCategory?: string;
}

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  // Unwrap the params promise
  const { eventId } = use(params);
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: eventData, isError } = useGetEventByIdQuery(eventId);

  useEffect(() => {
    if (eventData) {
      setEvent({
        eventId: eventData.eventId,
        title: eventData.title,
        description: eventData.description || 'No description available.',
        image: eventData.image,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        maxSeat: eventData.maxSeat,
        type: eventData.type,
        sportCategory: eventData.sportCategory,
      });
      setIsLoading(false);
    } else if (isError) {
      setError('Failed to load event details');
      setIsLoading(false);
    }
  }, [eventData, isError]);

  // Format date from YYYY-MM-DD to Month Day, Year
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format time from HH:MM:SS to hh:mm AM/PM
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-12 w-full mt-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-2xl mx-auto bg-destructive/10 text-destructive p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
          <p className="mb-4">The event you're looking for doesn't exist or has been removed.</p>
          <Link href="/events">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/events" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="relative h-64 w-full rounded-lg overflow-hidden mb-6">
              <Image
                src={event.image || "/event-placeholder.jpg"}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />

              {event.type && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-0">
                    {event.type}
                  </Badge>
                </div>
              )}
            </div>
            
            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Date & Time</h3>
                  <p className="text-muted-foreground">
                    {formatDate(event.date)} {event.time && `• ${formatTime(event.time)}`}
                  </p>
                </div>
              </div>
              
              {event.location && (
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p className="text-muted-foreground">
                      {event.location}
                    </p>
                  </div>
                </div>
              )}
              
              {event.maxSeat && (
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Available Seats</h3>
                    <p className="text-muted-foreground">{event.maxSeat} seats</p>
                  </div>
                </div>
              )}
              
              {event.sportCategory && (
                <div className="flex items-start">
                  <div className="w-5 h-5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Sport Category</h3>
                    <p className="text-muted-foreground">{event.sportCategory}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="bg-card border rounded-lg p-6 sticky top-6">
              <h2 className="text-2xl font-bold mb-4">Event Details</h2>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-line">
                  {event.description}
                </p>
              </div>
              
              <div className="mt-8 space-y-4">
                <RegisterButton 
                  eventId={event.eventId}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                />
                
                <div className="text-center text-sm text-muted-foreground">
                  Have questions?{' '}
                  <a href="#" className="text-green-600 hover:underline">
                    Contact the organizer
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

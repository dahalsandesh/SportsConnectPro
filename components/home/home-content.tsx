"use client";

import { useGetCountDataQuery, useGetEventsQuery } from "@/redux/api/publicApi";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Users, MapPin, Trophy, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FeaturedVenues from "@/components/featured-venues";
import FeaturedCourts from "@/components/featured-courts";
import HowItWorks from "@/components/how-it-works";
import Testimonials from "@/components/testimonials";
import { SportsEvent } from "@/types/api";

interface StatsCardProps {
  value: string | number;
  label: string;
  isLoading?: boolean;
}

const StatsCard = ({ value, label, isLoading = false }: StatsCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center">
    {isLoading ? (
      <Skeleton className="h-10 w-24 mx-auto mb-2" />
    ) : (
      <div className="text-green-600 text-4xl font-bold mb-2">{value}</div>
    )}
    <div className="text-gray-600">{label}</div>
  </div>
);

interface EventCardProps {
  event: SportsEvent;
}

const EventCard = ({ event }: EventCardProps) => {
  const formattedDate = event.date ? format(new Date(event.date), 'MMM d, yyyy') : 'TBD';
  const formattedTime = event.time ? format(new Date(`2000-01-01T${event.time}`), 'h:mm a') : '';

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 left-2">
          <Badge className="bg-green-600">Event</Badge>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
        <div className="flex items-center text-gray-500 mb-2">
          <Calendar className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {formattedDate} {formattedTime && `• ${formattedTime}`}
          </span>
        </div>
        {event.location && (
          <div className="flex items-center text-gray-500 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{event.location}</span>
          </div>
        )}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-sm text-gray-500">Max Seats: {event.maxSeat || 'N/A'}</span>
          </div>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function HomeContent() {
  const {
    data: stats,
    isLoading: isLoadingStats,
    isError: isErrorStats,
  } = useGetCountDataQuery();

  const {
    data: events = [],
    isLoading: isLoadingEvents,
    isError: isErrorEvents,
  } = useGetEventsQuery();

  // Show skeleton loaders while loading
  if (isLoadingStats) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <StatsCard key={i} value="" label="Loading..." isLoading />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show error state if stats fail to load
  if (isErrorStats || !stats) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-100 text-red-700 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Failed to load statistics</h3>
            <p className="text-sm">Please try refreshing the page or contact support if the issue persists.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard 
              value={stats.venue_count || 0} 
              label="Venues" 
            />
            <StatsCard 
              value={stats.normal_user_count || 0} 
              label="Happy Players" 
            />
            <StatsCard 
              value={stats.booking_count || 0} 
              label="Bookings" 
            />
            <StatsCard 
              value={typeof stats.avg_rating === 'number' ? stats.avg_rating.toFixed(1) : 'N/A'} 
              label="Avg. Rating" 
            />
          </div>
        </div>
      </section>

      {/* Featured Venues */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Venues</h2>
            <Link href="/venues">
              <Button variant="outline" className="gap-2">
                View All Venues <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <FeaturedVenues />
        </div>
      </section>

      {/* Featured Courts */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Courts</h2>
            <Link href="/courts">
              <Button variant="outline" className="gap-2">
                View All Courts <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <FeaturedCourts />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <HowItWorks />
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <Link href="/events">
              <Button variant="outline" className="gap-2">
                View All Events <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoadingEvents ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white border rounded-lg overflow-hidden shadow-md">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : isErrorEvents ? (
            <div className="bg-red-100 text-red-700 p-6 rounded-lg text-center">
              <h3 className="text-lg font-medium mb-2">Failed to load events</h3>
              <p className="text-sm">Please try again later or contact support if the issue persists.</p>
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.slice(0, 3).map((event) => (
                <EventCard key={event.eventId} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No upcoming events at the moment. Check back later!</p>
            </div>
          )}
        </div>
      </section>

      <Testimonials />
    </>
  );
}

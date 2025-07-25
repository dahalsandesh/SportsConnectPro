"use client";

import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/image-utils";
import { ArrowRight, Calendar, Users, MapPin } from "lucide-react";
import { format } from "date-fns";
import EventCard from "@/components/event-card"; // Use the shared EventCard

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FeaturedVenues from "@/components/featured-venues";
import FeaturedCourts from "@/components/featured-courts";
import HowItWorks from "@/components/how-it-works";
import Testimonials from "@/components/testimonials";
import { useGetCountDataQuery, useGetEventsQuery } from "@/redux/api/publicApi";
import { SportsEvent } from "@/types/api";

interface StatsCardProps {
  value: string | number;
  label: string;
  isLoading?: boolean;
}

const StatsCard = ({ value, label, isLoading = false }: StatsCardProps) => (
  <Card className="text-center h-full">
    <CardContent className="p-6">
      {isLoading ? (
        <Skeleton className="h-10 w-24 mx-auto mb-2" />
      ) : (
        <h3 className="text-3xl font-bold text-green-600 mb-2">{value}</h3>
      )}
      <p className="text-muted-foreground">{label}</p>
    </CardContent>
  </Card>
);

interface EventCardProps {
  event: SportsEvent;
}



export default function DynamicHomeContent() {
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
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-destructive/10 text-destructive p-6 rounded-lg">
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
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
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

      {/* Featured Sections */}
      <FeaturedVenues />
      <FeaturedCourts />
      <HowItWorks />

      {/* Upcoming Events */}
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
            <h2 className="text-3xl font-bold text-foreground">Upcoming Events</h2>
            <Button asChild variant="outline" className="gap-2 border-border text-foreground hover:bg-accent">
              <Link href="/events">
                View All Events <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoadingEvents ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-9 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : isErrorEvents ? (
            <div className="bg-destructive/10 text-destructive p-6 rounded-lg text-center">
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

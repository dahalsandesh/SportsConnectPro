'use client';

import { useGetEventsQuery } from "@/redux/api/publicApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Calendar as CalendarIcon, MapPin, Trophy, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EventCard from "@/components/event-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

export default function EventsPage() {
  const { data: events = [], isLoading, isError } = useGetEventsQuery();
  const [searchQuery, setSearchQuery] = useState('');
  const [eventType, setEventType] = useState('all');

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       event.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = eventType === 'all' || event.type?.toLowerCase() === eventType;
    return matchesSearch && matchesType;
  });

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="text-destructive">
          Failed to load events. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Upcoming Events</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover and participate in exciting sports events and tournaments
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events..."
            className="w-full pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={eventType} onValueChange={setEventType}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="tournament">Tournaments</SelectItem>
              <SelectItem value="league">Leagues</SelectItem>
              <SelectItem value="friendly">Friendly Matches</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <EventCard key={event.eventId} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No events found. Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}

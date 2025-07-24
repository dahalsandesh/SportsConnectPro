"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useGetCourtsQuery } from "@/redux/api/venue-owner/courtApi";
import { useGetSportsEventsQuery, useGetRegisteredUsersQuery } from "@/redux/api/venue-owner/eventApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface CourtType {
  courtId: string;
  courtName: string;
  courtType: string;
  courtCategory: string;
  isActive: boolean;
}

interface EventType {
  eventId: string;
  title: string;
  date: string;
  time: string;
  maxSeat: number;
}

interface RegisteredUser {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  registeredAt?: string;
}

function CourtsSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-4">
      <Skeleton className="h-10 w-64 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function RegisteredUsersPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');
  const [selectedCourt, setSelectedCourt] = useState<CourtType | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  
  // Get courts for the logged-in venue owner
  const { data: courts = [], isLoading: isLoadingCourts } = useGetCourtsQuery(undefined, {
    refetchOnMountOrArgChange: true
  });
  
  // Get events for the selected court
  const { data: eventsResponse = [], isLoading: isLoadingEvents } = useGetSportsEventsQuery(
    { courtId: selectedCourt?.courtId || '' },
    { 
      skip: !selectedCourt?.courtId,
      refetchOnMountOrArgChange: true
    }
  );
  
  // Handle the events data structure from the API
  const events = Array.isArray(eventsResponse) ? eventsResponse : [];
  
  // Get registered users for the selected event
  const { data: registeredUsers = [], isLoading: isLoadingUsers } = useGetRegisteredUsersQuery(
    { eventId: selectedEvent?.eventId || '' },
    { 
      skip: !selectedEvent?.eventId,
      refetchOnMountOrArgChange: true
    }
  );

  // Reset selected event when court changes
  useEffect(() => {
    setSelectedEvent(null);
  }, [selectedCourt]);

  // Set initial event from URL if provided
  useEffect(() => {
    if (eventId && events.length > 0) {
      const event = events.find((e: any) => e.eventId === eventId);
      if (event) {
        setSelectedEvent(event);
      }
    }
  }, [eventId, events]);

  // Loading state
  if (isLoadingCourts) {
    return <CourtsSkeleton />;
  }

  if (!courts?.length) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Registered Users</h1>
        <p>No courts available. Please add a court first.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Registered Users</h1>
        <p className="text-muted-foreground">View users registered for your events</p>
      </div>

      {/* Court Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Court</label>
        <Select
          value={selectedCourt?.courtId || ''}
          onValueChange={(value) => {
            const court = courts.find(c => c.courtId === value);
            setSelectedCourt(court || null);
          }}
        >
          <SelectTrigger className="w-full md:w-1/2">
            <SelectValue placeholder="Select a court" />
          </SelectTrigger>
          <SelectContent>
            {courts.map((court) => (
              <SelectItem key={court.courtId} value={court.courtId}>
                <div className="flex items-center gap-2">
                  <span>{court.courtName}</span>
                  <Badge variant="outline" className="text-xs">
                    {court.courtCategory}
                  </Badge>
                  {!court.isActive && (
                    <Badge variant="destructive" className="text-xs">
                      Inactive
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Event Selection */}
      {selectedCourt && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Events for {selectedCourt.courtName}</h2>
          {isLoadingEvents ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => (
                <Card 
                  key={event.eventId}
                  className={`cursor-pointer transition-shadow hover:border-primary ${
                    selectedEvent?.eventId === event.eventId ? 'border-primary ring-2 ring-primary/20' : ''
                  }`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {format(new Date(event.date), 'MMM d, yyyy')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {event.time}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Max {event.maxSeat} participants
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(event);
                        }}
                      >
                        View Users
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 border rounded-lg">
              <p className="text-muted-foreground">No events found for this court.</p>
            </div>
          )}
        </div>
      )}

      {/* Registered Users Table */}
      {selectedEvent && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Registered Users</h3>
              <p className="text-sm text-muted-foreground">
                {selectedEvent.title} • {format(new Date(selectedEvent.date), 'MMM d, yyyy')} • {selectedEvent.time}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedEvent(null)}
            >
              Back to Events
            </Button>
          </div>

          {isLoadingUsers ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : registeredUsers.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registeredUsers.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phoneNumber || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                          Registered
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-muted-foreground">No users have registered for this event yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );


}

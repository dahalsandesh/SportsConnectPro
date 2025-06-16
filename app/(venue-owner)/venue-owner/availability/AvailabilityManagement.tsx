"use client";

import { useState } from "react";
import { useGetVenueDetailsQuery } from "@/redux/api/venueManagementApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";

export default function AvailabilityManagement() {
  const { data, isLoading, error } = useGetVenueDetailsQuery();
  const venues = Array.isArray(data) ? data : data ? [data] : [];
  const [selectedVenue, setSelectedVenue] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    () => new Date()
  );

  if (isLoading) return <div>Loading venues...</div>;
  if (error) return <div>Error loading venues.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Availability Management</h2>
          <p className="text-muted-foreground">
            Manage court availability and schedules
          </p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Select Venue & Date</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Venue</label>
              <Select value={selectedVenue} onValueChange={setSelectedVenue}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a venue" />
                </SelectTrigger>
                <SelectContent>
                  {venues.map((venue: any) => (
                    <SelectItem key={venue.venueId} value={venue.venueId}>
                      {venue.venueName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Time Slots</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedVenue && selectedDate ? (
              <div className="space-y-4">
                <div className="text-muted-foreground">
                  (Time slots for the selected venue and date will appear here.)
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                Select a venue and date to view available time slots
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

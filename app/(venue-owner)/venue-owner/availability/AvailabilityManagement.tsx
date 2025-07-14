"use client";

import { useState, useEffect } from "react";
import { useGetVenuesQuery } from "@/redux/api/venue-owner/venueApi";
import { useGetCourtsQuery } from "@/redux/api/venue-owner/courtApi";
import { useGetTicketsQuery } from "@/redux/api/venue-owner/timeSlotsApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function AvailabilityManagement() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<string>("");
  const [selectedCourt, setSelectedCourt] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    () => new Date()
  );

  // Get user ID from localStorage when component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          const userId = user?.id || user?.userId || user?.user_id || null;
          setCurrentUserId(userId);
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error);
        }
      }
    }
  }, []);

  // Get venues for the current user
  const { data: venuesData, isLoading: isLoadingVenues } = useGetVenuesQuery(
    { userId: currentUserId || "" },
    { skip: !currentUserId }
  );

  // Get courts for the selected venue
  const { data: courts = [], isLoading: isLoadingCourts } = useGetCourtsQuery();

  // Get time slots for the selected court and date
  const { data: timeSlots, isLoading: isLoadingSlots } = useGetTicketsQuery(
    selectedCourt && selectedDate
      ? {
          courtId: selectedCourt,
          date: format(selectedDate, "yyyy-MM-dd"),
        }
      : null
  );

  const venues = Array.isArray(venuesData)
    ? venuesData
    : venuesData
    ? [venuesData]
    : [];

  if (isLoadingVenues) return <div>Loading venues...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Time Slots Management</h2>
          <p className="text-muted-foreground">
            Manage court availability and schedules
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Select Court & Date</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Court</label>
              <Select value={selectedCourt} onValueChange={setSelectedCourt}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a court" />
                </SelectTrigger>
                <SelectContent>
                  {courts.map((court: any) => (
                    <SelectItem key={court.courtId} value={court.courtId}>
                      {court.courtName}
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
            {selectedCourt && selectedDate ? (
              <div className="space-y-4">
                {isLoadingSlots ? (
                  <div>Loading time slots...</div>
                ) : timeSlots.length === 0 ? (
                  <div className="text-center text-muted-foreground">
                    No time slots found for the selected court and date
                  </div>
                ) : (
                  <div className="space-y-2">
                    {timeSlots.map((slot: any) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">
                            {slot.startTime} - {slot.endTime}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Rate: ${slot.rate}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              slot.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                            {slot.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                Select a court and date to view time slots
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

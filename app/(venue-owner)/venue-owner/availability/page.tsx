"use client";

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useGetTicketsQuery, useCreateTicketsMutation } from "@/redux/api/venue-owner/timeSlotsApi";
import { useGetCourtsQuery } from "@/redux/api/venue-owner/courtApi";

interface TimeSlot {
  startTime: string;
  endTime: string;
  specialPrice: string | null;
}

// Separate component for Court Select to isolate state
const CourtSelect = React.memo(({ 
  value, 
  onChange,
  courts,
  isLoading 
}: { 
  value: string; 
  onChange: (value: string) => void;
  courts: Array<{ courtId: string; courtName: string }>;
  isLoading: boolean;
}) => {
  // Memoize the onValueChange handler to prevent unnecessary re-renders
  const handleValueChange = useCallback((newValue: string) => {
    if (newValue !== value) {
      onChange(newValue);
    }
  }, [onChange, value]);

  return (
    <Select value={value} onValueChange={handleValueChange} disabled={isLoading}>
      <SelectTrigger>
        <SelectValue placeholder={isLoading ? "Loading courts..." : "Select a court"} />
      </SelectTrigger>
      <SelectContent>
        {courts.map((court) => (
          <SelectItem key={court.courtId} value={court.courtId}>
            {court.courtName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});

// Add display name for better debugging
CourtSelect.displayName = 'CourtSelect';

export default function AvailabilityPage() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedCourt, setSelectedCourt] = useState<string>("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { startTime: "", endTime: "", specialPrice: null },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get courts for the dropdown
  const { data: courts = [], isLoading: isLoadingCourts } = useGetCourtsQuery(
    { venueId: "current" },
    { refetchOnMountOrArgChange: true }
  );

  // Format date only once when it changes
  const formattedDate = useMemo(() => format(date, "yyyy-MM-dd"), [date]);

  // Memoize query options to prevent unnecessary re-renders
  const ticketsQueryOptions = useMemo(() => ({
    skip: !selectedCourt,
    refetchOnMountOrArgChange: true
  }), [selectedCourt]);

  // Get existing time slots only when court or date changes
  const { data: existingSlots = [], refetch: refetchSlots } = useGetTicketsQuery(
    { 
      courtId: selectedCourt, 
      date: formattedDate 
    },
    ticketsQueryOptions
  );

  const [createTickets] = useCreateTicketsMutation();

  // Handle court change
  const handleCourtChange = useCallback((courtId: string) => {
    setSelectedCourt(courtId);
    // Reset time slots when court changes
    setTimeSlots([{ startTime: "", endTime: "", specialPrice: null }]);
  }, []);

  // Update time slots when existing slots change
  useEffect(() => {
    // Skip if no existing slots and we already have the default empty slot
    if ((!existingSlots || existingSlots.length === 0) && timeSlots.length === 1 && 
        !timeSlots[0].startTime && !timeSlots[0].endTime) {
      return;
    }

    if (existingSlots && existingSlots.length > 0) {
      // Only update if the slots have actually changed
      const newSlots = existingSlots.map(slot => ({
        startTime: slot.startTime?.split(":").slice(0, 2).join(":") || "",
        endTime: slot.endTime?.split(":").slice(0, 2).join(":") || "",
        specialPrice: slot.specialPrice?.toString() || null,
      }));
      
      // Only update if the slots have actually changed
      const hasChanged = newSlots.length !== timeSlots.length || 
        newSlots.some((slot, index) => {
          const current = timeSlots[index];
          return !current || 
                 slot.startTime !== current.startTime || 
                 slot.endTime !== current.endTime ||
                 slot.specialPrice !== current.specialPrice;
        });
      
      if (hasChanged) {
        setTimeSlots(newSlots);
      }
    } else if (selectedCourt && timeSlots.length !== 1) {
      // Only reset if we don't already have exactly one empty slot
      setTimeSlots([{ startTime: "", endTime: "", specialPrice: null }]);
    }
  }, [existingSlots, selectedCourt, timeSlots]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourt) {
      toast({
        title: "Error",
        description: "Please select a court",
        variant: "destructive",
      });
      return;
    }

    // Prepare time slots data
    const validSlots = timeSlots
      .filter(slot => slot.startTime && slot.endTime)
      .map(slot => ({
        startTime: slot.startTime.includes(':') ? slot.startTime : `${slot.startTime}:00`,
        endTime: slot.endTime.includes(':') ? slot.endTime : `${slot.endTime}:00`,
        specialPrice: slot.specialPrice ? parseFloat(slot.specialPrice) : null,
      }));

    if (validSlots.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one valid time slot",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting time slots:', {
        courtId: selectedCourt,
        date: formattedDate,
        ticketList: validSlots
      });

      const result = await createTickets({
        courtId: selectedCourt,
        date: formattedDate,
        ticketList: validSlots,
      }).unwrap();

      console.log("API Response:", result);

      toast({
        title: "Success",
        description: "Time slots saved successfully",
      });
      
      // Clear the form after successful submission
      setTimeSlots([{ startTime: "", endTime: "", specialPrice: null }]);
      refetchSlots();
    } catch (error: any) {
      console.error("Error saving time slots:", {
        error,
        response: error?.data,
        status: error?.status,
      });
      
      let errorMessage = "Failed to save time slots";
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.status === 400) {
        errorMessage = "Invalid request. Please check your input and try again.";
      } else if (error?.status === 401) {
        errorMessage = "Please log in to perform this action.";
      } else if (error?.status === 403) {
        errorMessage = "You don't have permission to perform this action.";
      } else if (error?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedCourt, formattedDate, timeSlots, createTickets, refetchSlots, toast]);

  // Memoize the time slot handlers
  const handleAddTimeSlot = useCallback(() => {
    setTimeSlots(prev => [...prev, { startTime: "", endTime: "", specialPrice: null }]);
  }, []);

  const handleRemoveTimeSlot = useCallback((index: number) => {
    setTimeSlots(prev => {
      const newSlots = [...prev];
      newSlots.splice(index, 1);
      return newSlots.length ? newSlots : [{ startTime: "", endTime: "", specialPrice: null }];
    });
  }, []);

  const handleTimeSlotChange = useCallback((index: number, field: keyof TimeSlot, value: string) => {
    setTimeSlots(prev => {
      const newSlots = [...prev];
      newSlots[index] = { ...newSlots[index], [field]: value };
      return newSlots;
    });
  }, []);

  const handleDateChange = useCallback((newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
    }
  }, []);

  // Memoize the disabled state for the date
  const isDateDisabled = useCallback((date: Date) => date < new Date(), []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Availability</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Court Selection */}
          <div className="space-y-2">
            <Label htmlFor="court">Select Court</Label>
            <CourtSelect 
              value={selectedCourt}
              onChange={handleCourtChange}
              courts={courts}
              isLoading={isLoadingCourts}
            />
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label>Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  disabled={isDateDisabled}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Time Slots */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Time Slots</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddTimeSlot}
              disabled={!selectedCourt}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Slot
            </Button>
          </div>

          <div className="space-y-4">
            {timeSlots.map((slot, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-3">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => handleTimeSlotChange(index, "startTime", e.target.value)}
                    required
                    disabled={!selectedCourt}
                  />
                </div>
                <div className="col-span-3">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => handleTimeSlotChange(index, "endTime", e.target.value)}
                    required
                    disabled={!selectedCourt}
                  />
                </div>
                <div className="col-span-4">
                  <Label>Special Price (optional)</Label>
                  <Input
                    type="number"
                    placeholder="Leave empty for default price"
                    value={slot.specialPrice || ""}
                    onChange={(e) => handleTimeSlotChange(index, "specialPrice", e.target.value)}
                    disabled={!selectedCourt}
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveTimeSlot(index)}
                    disabled={timeSlots.length <= 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting || !selectedCourt}>
                {isSubmitting ? "Saving..." : "Save Time Slots"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

// Skeleton component for loading state
export function AvailabilitySkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-64 mt-2 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="grid gap-4">
        <div className="h-[500px] w-full bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}

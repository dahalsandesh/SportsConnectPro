"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { format, parseISO, isToday, isBefore, startOfToday, addDays, parse, addMinutes, isWithinInterval } from "date-fns";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { TimeSlotGrid } from "@/components/TimeSlotGrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Plus, Trash2, Clock, X, DollarSign, Info, Grid, List, Loader2, Pencil } from "lucide-react";
import { useGetTicketsQuery, useCreateTicketsMutation, useUpdateTicketStatusMutation } from "@/redux/api/venue-owner/timeSlotsApi";
import { useGetCourtsQuery } from "@/redux/api/venue-owner/courtApi";
import { Court } from "@/types/api";
import { skipToken } from "@reduxjs/toolkit/query";
import { AvailabilitySkeleton } from "./components/AvailabilitySkeleton";

interface TimeSlot {
  id?: string;
  courtId: string;
  date?: string;
  startTime: string;
  endTime: string;
  specialPrice?: number | null;
  isActive: boolean;
  rate?: number | null;
}

interface TimeSlotApiPayload {
  startTime: string;
  endTime: string;
  specialPrice: number | null; // Changed to match API expectation
}

interface TimeSlotResponse {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  rate: number | null;
}

interface UpdateTicketPayload {
  ticketId: string;
  rate: number | null;
  isActive: boolean;
}

interface UpdateTicketStatusPayload {
  ticketId: string;
  isActive: boolean;
}

interface TimeSlotItem {
  time: string;
  formattedTime: string;
  isSelected: boolean;
  isBooked: boolean;
  rate?: number;
}

export default function AvailabilityPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedCourt, setSelectedCourt] = useState<string>("");
  const [timeSlots, setTimeSlots] = useState<Array<{
    id?: string;
    courtId: string;
    date?: string;
    startTime: string;
    endTime: string;
    specialPrice?: number | null;
    isActive: boolean;
    rate?: number | null;
  }>>([]);
  const [selectedSlots, setSelectedSlots] = useState<TimeSlotItem[]>([]);
  const [specialPrice, setSpecialPrice] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSlot, setEditingSlot] = useState<(TimeSlot & { rate?: number | null }) | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  
  // Helper function to check if a time slot is in the past
  const isPastDate = useCallback((dateStr: string, timeStr: string): boolean => {
    if (!dateStr || !timeStr) return false;
    try {
      const date = new Date(dateStr);
      const [hours, minutes] = timeStr.split(':').map(Number);
      date.setHours(hours, minutes, 0, 0);
      
      const now = new Date();
      return date < now;
    } catch (error) {
      console.error('Error checking if date is in past:', error);
      return false;
    }
  }, []);
  
  const [createTickets] = useCreateTicketsMutation();
  const [updateTicketStatus] = useUpdateTicketStatusMutation();

  const { data: courts = [], isLoading: isLoadingCourts } = useGetCourtsQuery(undefined);

  const { 
    data: ticketsData = [], 
    isLoading: isLoadingTickets, 
    refetch: refetchTickets 
  } = useGetTicketsQuery(
    selectedCourt && date ? { 
      courtId: selectedCourt, 
      date: format(date, "yyyy-MM-dd") 
    } : skipToken,
    { skip: !selectedCourt || !date }
  );

  const formattedDate = useMemo(() => format(date, "yyyy-MM-dd"), [date]);

  const selectedCourtName = useMemo(() => {
    const court = courts.find((c: any) => c.courtId === selectedCourt);
    return court ? court.courtName : '';
  }, [courts, selectedCourt]);

  const handleCourtChange = useCallback((courtId: string) => {
    setSelectedCourt(courtId);
  }, []);

  const handleDateChange = useCallback((newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
    }
  }, []);

  const isDateDisabled = useCallback((date: Date) => {
    return isBefore(date, startOfToday());
  }, []);

  // Handle toggling time slot status (activate/deactivate)
  const handleToggleStatus = useCallback(async (slot: TimeSlot) => {
    if (!slot.id) return;
    
    try {
      setIsSubmitting(true);
      const newStatus = !slot.isActive;
      
      const payload = {
        courtId: slot.courtId,
        ticketId: slot.id,
        date: formattedDate,
        startTime: slot.startTime,
        endTime: slot.endTime || calculateEndTime(slot.startTime),
        rate: slot.rate || null,
        isActive: newStatus ? 1 : 0
      };
      
      console.log('Toggling time slot status with payload:', payload);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://10.0.2.2:8000';
      const response = await fetch(`${apiUrl}/web/api/v1/venue/UpdateTicket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update time slot status');
      }
      
      toast({ 
        title: "Success", 
        description: `Time slot Rs.{newStatus ? 'activated' : 'deactivated'} successfully` 
      });
      
      // Refresh the time slots
      await refetchTickets();
    } catch (error: any) {
      console.error(`Error Rs.{slot.isActive ? 'deactivating' : 'activating'} time slot:`, error);
      toast({ 
        title: "Error", 
        description: error.message || `Failed to Rs.{slot.isActive ? 'deactivate' : 'activate'} time slot. Please try again.`, 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formattedDate, refetchTickets, toast]);

  const handleAddTimeSlots = useCallback(async (newSlots: Array<{ startTime: string; endTime: string; rate?: number | null }>) => {
    if (!selectedCourt) {
      toast({ title: "Error", description: "Please select a court first", variant: "destructive" });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const formattedSlots = newSlots.map(slot => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
        specialPrice: slot.rate !== undefined ? Number(slot.rate) : null
      }));

      await createTickets({
        courtId: selectedCourt,
        date: formattedDate,
        ticketList: formattedSlots
      }).unwrap();

      toast({ 
        title: "Success", 
        description: `Rs.{newSlots.length} time slots added successfully` 
      });
      
      await refetchTickets();
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to add time slots";
      toast({ 
        title: "Error", 
        description: errorMessage, 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedCourt, formattedDate, createTickets, refetchTickets, toast]);

  const formatTime = useCallback((timeString: string | undefined): string => {
    if (!timeString) return '';
    try {
      // Handle cases where timeString might be in different formats
      const timeParts = timeString.split(':');
      if (timeParts.length < 2) return timeString; // Invalid time format
      
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);
      
      if (isNaN(hours) || isNaN(minutes)) {
        console.warn('Invalid time values:', { hours, minutes });
        return timeString;
      }
      
      // Create a date object with today's date and the specified time
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date created from time:', timeString);
        return timeString;
      }
      
      return format(date, 'h:mm a');
    } catch (error) {
      console.error('Error formatting time:', error, 'Time string:', timeString);
      return timeString;
    }
  }, []);

  // Update available slots when existing slots or selection changes
  useEffect(() => {
    if (!ticketsData || !Array.isArray(ticketsData)) {
      setTimeSlots([]);
      return;
    }

    try {
      const formattedSlots = ticketsData.map((ticket: TimeSlotResponse) => ({
        id: ticket.id,
        courtId: selectedCourt || '',
        date: ticket.date,
        startTime: ticket.startTime.split(':').slice(0, 2).join(':'), // Convert 12:00:00 to 12:00
        endTime: ticket.endTime.split(':').slice(0, 2).join(':'),   // Convert 13:00:00 to 13:00
        specialPrice: ticket.rate,
        isActive: ticket.isActive,
        rate: ticket.rate
      }));

      setTimeSlots(prevSlots => {
        if (JSON.stringify(prevSlots) !== JSON.stringify(formattedSlots)) {
          return formattedSlots;
        }
        return prevSlots;
      });
    } catch (error) {
      console.error('Error formatting time slots:', error);
      toast({
        title: 'Error',
        description: 'Failed to load time slots',
        variant: 'destructive'
      });
    }
  }, [ticketsData, selectedCourt, toast]);

  // Generate time slots for the time selectors (6 AM to 10 PM in 30-minute intervals)
  const TIME_SLOTS = useMemo(() => {
    const slots: Array<{ value: string; label: string }> = [];
    for (let hour = 6; hour < 22; hour++) {
      for (const minute of ['00', '30']) {
        const time = `Rs.{hour.toString().padStart(2, '0')}:Rs.{minute}`;
        slots.push({ 
          value: time,
          label: formatTime(time)
        });
      }
    }
    return slots;
  }, [formatTime]);

  // Handle adding a single time slot (for list view)
  const handleAddTimeSlot = useCallback(async () => {
    if (!selectedCourt || !startTime) {
      toast({
        title: "Error",
        description: "Please select a court and start time",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Always create a 1-hour slot
      const endTimeValue = calculateEndTime(startTime);
      
      // Format the time slot according to API requirements
      const timeSlot = {
        startTime,
        endTime: endTimeValue,
        specialPrice: specialPrice ? Number(specialPrice) : null
      };
      
      // Create the time slot using the API
      await createTickets({
        courtId: selectedCourt,
        date: formattedDate,
        ticketList: [timeSlot]
      }).unwrap();

      toast({ 
        title: "Success", 
        description: `Time slot Rs.{startTime} - Rs.{endTimeValue} added successfully` 
      });
      
      // Reset form
      setStartTime('');
      setSpecialPrice('');
      
      // Refresh the time slots
      await refetchTickets();
    } catch (error: any) {
      console.error("Error adding time slot:", error);
      const errorMessage = error?.data?.message || "Failed to add time slot. Please try again.";
      toast({ 
        title: "Error", 
        description: errorMessage, 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedCourt, formattedDate, startTime, specialPrice, createTickets, refetchTickets, toast]);

  // Helper function to calculate end time (1 hour after start time)
  const calculateEndTime = (start: string): string => {
    const [hours, minutes] = start.split(':').map(Number);
    const nextHour = (hours + 1) % 24; // Handle midnight rollover
    return `Rs.{nextHour.toString().padStart(2, '0')}:Rs.{minutes.toString().padStart(2, '0')}`;
  };

  // Handle editing a time slot
  const handleEditSlot = useCallback((slot: TimeSlot & { rate?: number | null }) => {
    if (!slot) {
      console.error('No slot provided to edit');
      return;
    }
    
    console.log('Editing slot:', JSON.stringify(slot, null, 2));
    
    try {
      // Ensure we have valid start and end times
      const startTime = slot.startTime || '';
      const endTime = slot.endTime || calculateEndTime(startTime);
      
      const slotData: TimeSlot = {
        id: slot.id || '',
        courtId: slot.courtId || selectedCourt || '',
        date: slot.date || formattedDate,
        startTime: startTime,
        endTime: endTime,
        rate: slot.rate !== undefined ? slot.rate : null,
        isActive: slot.isActive !== undefined ? slot.isActive : true
      };
      
      console.log('Setting editing slot data:', JSON.stringify(slotData, null, 2));
      
      // Update state in the correct order
      setEditingSlot(slotData);
      setSpecialPrice(slot.rate !== undefined && slot.rate !== null ? slot.rate.toString() : '');
      setStartTime(startTime);
      
      // Force a re-render to ensure modal opens
      setTimeout(() => {
        setIsEditing(true);
        console.log('Modal should now be open. isEditing:', true);
      }, 0);
      
    } catch (error) {
      console.error('Error preparing edit form:', error);
      toast({
        title: 'Error',
        description: 'Failed to prepare time slot for editing',
        variant: 'destructive'
      });
    }
  }, [formattedDate, selectedCourt, toast]);

  // Handle updating a time slot
  const handleUpdateSlot = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlot || !editingSlot.id || !selectedCourt) {
      toast({
        title: "Error",
        description: "Missing required information to update time slot",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      const endTimeValue = editingSlot.endTime || calculateEndTime(editingSlot.startTime);
      
      const payload = {
        courtId: selectedCourt,
        ticketId: editingSlot.id,
        date: formattedDate,
        startTime: editingSlot.startTime,
        endTime: endTimeValue,
        rate: specialPrice ? parseFloat(specialPrice) : null,
        isActive: editingSlot.isActive ? 1 : 0
      };
      
      console.log('Updating time slot with payload:', payload);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://10.0.2.2:8000';
      const response = await fetch(`${apiUrl}/web/api/v1/venue/UpdateTicket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Ensure token is included
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update time slot');
      }
      
      const result = await response.json();
      console.log('Update API response:', result);
      
      toast({
        title: "Success",
        description: "Time slot updated successfully"
      });
      
      // Reset form and close modal
      setIsEditing(false);
      setEditingSlot(null);
      setSpecialPrice('');
      
      // Refresh the time slots
      await refetchTickets();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error("Error updating time slot:", error);
      toast({
        title: "Error",
        description: errorMessage || "Failed to update time slot. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [editingSlot, selectedCourt, formattedDate, specialPrice, refetchTickets, toast]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manage Availability</h1>
          {selectedCourt && (
            <p className="text-sm text-muted-foreground mt-1">
              Managing slots for {selectedCourtName} on {format(date, 'PPP')}
            </p>
          )}
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <div className="inline-flex items-center justify-center rounded-md bg-muted p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 px-3"
            >
              <Grid className="h-4 w-4 mr-2" />
              <span>Grid View</span>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 px-3"
            >
              <List className="h-4 w-4 mr-2" />
              <span>List View</span>
            </Button>
          </div>
          <Button
            variant={isCreating ? "outline" : "default"}
            onClick={() => {
              setIsCreating(!isCreating);
              setSelectedSlots([]);
              setEditingSlot(null);
            }}
            disabled={!selectedCourt}
            className="ml-2"
          >
            {isCreating ? (
              <>
                <X className="h-4 w-4 mr-2" /> Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" /> Add New Slots
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column - Court and Date Selection */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Court & Date</CardTitle>
              <CardDescription>Select court and date to manage availability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Court</Label>
                <Select 
                  value={selectedCourt}
                  onValueChange={handleCourtChange}
                  disabled={isLoadingCourts}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingCourts ? "Loading courts..." : "Select a court"} />
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
                <Label>Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={!selectedCourt}
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
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 text-primary" />
                <p>Slots are in 1 hour intervals</p>
              </div>
              <div className="flex items-start gap-2">
                <DollarSign className="h-4 w-4 mt-0.5 text-primary" />
                <p>Set special prices or use default court pricing</p>
              </div>
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 text-primary" />
                <p>Click on a slot to select it</p>
              </div>
              <div className="flex items-start gap-2">
                <Grid className="h-4 w-4 mt-0.5 text-primary" />
                <p>Use grid view for bulk selection</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Time Slots */}
        <div className="lg:col-span-9">
          {isLoadingTickets ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading time slots...</span>
            </div>
          ) : isCreating ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Add New Time Slots</CardTitle>
                  <div className="inline-flex items-center justify-center rounded-md bg-muted p-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="h-8 px-3"
                    >
                      <Grid className="h-4 w-4 mr-2" />
                      <span>Grid View</span>
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="h-8 px-3"
                    >
                      <List className="h-4 w-4 mr-2" />
                      <span>List View</span>
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  {viewMode === 'grid' 
                    ? 'Click and drag to select multiple time slots'
                    : 'Add individual time slots with custom durations'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {viewMode === 'grid' ? (
                  <TimeSlotGrid
                    selectedDate={date}
                    courtId={selectedCourt || ''}
                    existingSlots={timeSlots.map(slot => ({
                      startTime: slot.startTime,
                      endTime: slot.endTime,
                      rate: slot.rate || undefined,
                      isActive: slot.isActive
                    }))}
                    onSlotsSelected={handleAddTimeSlots}
                    isLoading={isSubmitting}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label>Time Slot</Label>
                        <Select 
                          value={startTime}
                          onValueChange={(value) => {
                            setStartTime(value);
                            // Automatically set end time to 1 hour after start time
                            const [hours] = value.split(':').map(Number);
                            const nextHour = (hours + 1) % 24;
                            setEndTime(`Rs.{nextHour.toString().padStart(2, '0')}:00`);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select start time" />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_SLOTS.map((time) => (
                              <SelectItem key={time.value} value={time.value}>
                                {time.label} - {format(
                                  addMinutes(parse(time.value, 'HH:mm', new Date()), 60), 
                                  'h:mm a'
                                )}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Each slot is 1 hour long
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="specialPrice">Special Price (optional)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rs.</span>
                          <Input
                            id="specialPrice"
                            type="number"
                            placeholder="Enter special price"
                            value={specialPrice}
                            onChange={(e) => setSpecialPrice(e.target.value)}
                            className="pl-8"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={handleAddTimeSlot}
                        disabled={!startTime || isSubmitting}
                        className="w-full sm:w-auto"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          'Add Time Slot'
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : timeSlots.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Available Time Slots</h2>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreating(true);
                    setViewMode('grid');
                  }}
                  disabled={!selectedCourt}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Slots
                </Button>
              </div>
              <div className="space-y-3">
                {timeSlots
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((slot) => {
                    const isPast = isPastDate(formattedDate, slot.startTime);
                    const isActive = slot.isActive ?? true;
                    
                    return (
                      <div
                        key={slot.id}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg Rs.{
                          !isActive ? 'bg-muted/50' : ''
                        }`}
                      >
                        <div className="mb-3 sm:mb-0">
                          <div className="font-medium flex items-center">
                            <span>
                              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                            </span>
                            {isPast && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Past
                              </Badge>
                            )}
                            {!isActive && !isPast && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Inactive
                              </Badge>
                            )}
                          </div>
                          {slot.specialPrice && (
                            <div className="text-sm text-muted-foreground mt-1">
                              Special Price: Rs.{slot.specialPrice}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant={isActive ? 'outline' : 'secondary'}
                            onClick={() => handleToggleStatus(slot)}
                            disabled={!!isPast}
                            className="h-8"
                          >
                            {isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-destructive hover:text-destructive"
                            onClick={() => handleEditSlot(slot)}
                            disabled={!!isPast}
                          >
                            <Pencil className="h-4 w-4 mr-1" /> Edit
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">No time slots available</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add time slots to make this court bookable
              </p>
              <Button 
                onClick={() => {
                  setIsCreating(true);
                  setViewMode('grid');
                }}
                disabled={!selectedCourt}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Time Slots
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manage Availability</h1>
          {selectedCourt && (
            <p className="text-muted-foreground">
              Managing slots for {courts.find((c: Court) => c.courtId === selectedCourt)?.courtName || 'selected court'}
            </p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column - Court and Date Selection */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Court & Date</CardTitle>
              <CardDescription>Select a court and date to manage availability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="court">Court</Label>
                <Select
                  value={selectedCourt}
                  onValueChange={(value) => setSelectedCourt(value)}
                  disabled={isLoadingCourts}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a court" />
                  </SelectTrigger>
                  <SelectContent>
                    {courts.map((court) => (
                      <SelectItem key={court.courtId} value={court.courtId}>
                        {court.courtName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => newDate && setDate(newDate)}
                      disabled={(date) => date < startOfToday()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Time Slots */}
        <div className="lg:col-span-9">
          {isLoadingTickets ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading time slots...</span>
            </div>
          ) : isCreating ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Add New Time Slots</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCreating(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>
                  Select time slots to add for {format(date, "PPP")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {viewMode === 'grid' ? (
                  <TimeSlotGrid
                    selectedDate={date}
                    courtId={selectedCourt || ''}
                    onSlotsSelected={handleAddTimeSlots}
                    existingSlots={timeSlots.map(slot => ({
                      startTime: slot.startTime,
                      endTime: slot.endTime,
                      rate: slot.rate ?? undefined, // Convert null to undefined to match expected type
                      isActive: slot.isActive
                    }))}
                    isLoading={isSubmitting}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start-time">Start Time</Label>
                        <Input
                          id="start-time"
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end-time">End Time</Label>
                        <Input
                          id="end-time"
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          min={startTime}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="special-price">Special Price (optional)</Label>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="special-price"
                          type="number"
                          placeholder="0.00"
                          className="pl-8"
                          value={specialPrice}
                          onChange={(e) => setSpecialPrice(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsCreating(false)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddTimeSlot}
                        disabled={isSubmitting || !startTime || !endTime}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          'Add Slot'
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : timeSlots.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Available Time Slots</h2>
                <Button
                  onClick={() => setIsCreating(true)}
                  disabled={!selectedCourt || isPastDate(format(date, 'yyyy-MM-dd'), '23:59')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Time Slots
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {timeSlots.map((slot) => (
                  <Card key={slot.id} className="relative">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {format(parseISO(slot.startTime), 'h:mm a')} - {format(parseISO(slot.endTime), 'h:mm a')}
                          </CardTitle>
                          {slot.specialPrice && (
                            <p className="text-sm text-muted-foreground">
                              Rs.{slot.specialPrice}
                            </p>
                          )}
                        </div>
                        <Badge variant={slot.isActive ? 'default' : 'secondary'}>
                          {slot.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(slot)}
                          disabled={isSubmitting}
                        >
                          {slot.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleEditSlot(slot)}
                          disabled={isSubmitting}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium text-muted-foreground">No time slots available</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get started by adding time slots for {format(date, 'PPP')}
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => setIsCreating(true)}
                  disabled={!selectedCourt || isPastDate(format(date, 'yyyy-MM-dd'), '23:59')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Time Slots
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Edit Time Slot Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${isEditing && editingSlot ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {isEditing && editingSlot && (
          <form onSubmit={handleUpdateSlot} className="bg-background p-6 rounded-lg w-full max-w-md relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingSlot?.isActive ? 'Edit Time Slot' : 'Activate Time Slot'}
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsEditing(false);
                  setEditingSlot(null);
                  setSpecialPrice('');
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={editingSlot?.startTime || ''}
                    onChange={(e) => {
                      if (!editingSlot) return;
                      setEditingSlot({
                        ...editingSlot!,
                        startTime: e.target.value,
                        endTime: calculateEndTime(e.target.value)
                      });
                    }}
                    className="mt-1 w-full"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={editingSlot!.endTime || (editingSlot!.startTime ? calculateEndTime(editingSlot!.startTime) : '')}
                    disabled
                    className="mt-1 w-full bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Fixed 1-hour duration</p>
                </div>
              </div>
              
              <div>
                <Label>Special Price (leave empty for default price)</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="pl-8 w-full"
                    value={specialPrice}
                    onChange={(e) => setSpecialPrice(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="flex justify-between pt-4">
                <div>
                  {editingSlot?.isActive && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={async () => {
                        if (!editingSlot || !editingSlot.id || !editingSlot.courtId) return;
                        
                        if (confirm('Are you sure you want to deactivate this time slot?')) {
                          try {
                            setIsSubmitting(true);
                            const payload = {
                              courtId: editingSlot.courtId,
                              ticketId: editingSlot.id,
                              date: formattedDate,
                              startTime: editingSlot.startTime,
                              endTime: editingSlot.endTime || calculateEndTime(editingSlot.startTime),
                              rate: editingSlot.rate || null,
                              isActive: 0
                            };
                            
                            console.log('Deactivating time slot with payload:', payload);
                            
                            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://10.0.2.2:8000';
      const response = await fetch(`${apiUrl}/web/api/v1/venue/UpdateTicket`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify(payload),
                            });

                            if (!response.ok) {
                              const errorData = await response.json().catch(() => ({}));
                              throw new Error(errorData.message || 'Failed to deactivate time slot');
                            }
                            
                            toast({
                              title: "Success",
                              description: "Time slot deactivated successfully"
                            });
                            
                            setIsEditing(false);
                            setEditingSlot(null);
                            await refetchTickets();
                          } catch (error: unknown) {
                            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                            console.error("Error deactivating time slot:", error);
                            toast({
                              title: "Error",
                              description: errorMessage || "Failed to deactivate time slot. Please try again.",
                              variant: "destructive"
                            });
                          } finally {
                            setIsSubmitting(false);
                          }
                        }
                      }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processing...' : 'Deactivate'}
                    </Button>
                  )}
                </div>
                <div className="space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setEditingSlot(null);
                      setSpecialPrice('');
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

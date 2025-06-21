"use client";
import React, { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useGetTicketsQuery, useCreateBookingMutation } from "@/redux/api/publicApi";
import { format, addDays, isBefore } from "date-fns";
import { Loader2, Calendar as CalendarIcon, Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  rate: number;
  courtId?: string;
}

interface Court {
  courtId: string;
  name: string;
  sportCategory: string;
  hourlyRate: number;
}

interface PublicBookingCalendarProps {
  courts: Court[];
  defaultCourtId?: string;
  className?: string;
}

export default function PublicBookingCalendar({ 
  courts = [], 
  defaultCourtId = '',
  className = ''
}: PublicBookingCalendarProps) {
  const [selectedCourtId, setSelectedCourtId] = useState<string>(defaultCourtId || (courts[0]?.courtId ?? ""));
  const [selectedDate, setSelectedDate] = useState<string>(() => format(new Date(), "yyyy-MM-dd"));
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [isBooking, setIsBooking] = useState(false);
  
  const [createBooking] = useCreateBookingMutation();

  const { 
    data: slots = [], 
    isLoading, 
    isError,
    refetch: refetchSlots 
  } = useGetTicketsQuery(
    { courtId: selectedCourtId, date: selectedDate },
    { 
      skip: !selectedCourtId,
      refetchOnMountOrArgChange: true
    }
  );

  const selectedCourt = useMemo(() => 
    courts.find(court => court.courtId === selectedCourtId) || courts[0],
    [courts, selectedCourtId]
  );

  // Remove date restrictions for testing
  const minDate = "2000-01-01";
  const maxDate = "2100-12-31";
  
  // Generate an array of the next 30 days for the date picker
  const availableDates = Array.from({ length: 30 }, (_, i) => {
    const date = addDays(new Date(), i);
    return format(date, "yyyy-MM-dd");
  });

  // Filter and sort slots
  const availableSlots = useMemo(() => {
    if (!Array.isArray(slots)) return [];
    return slots
      .filter((slot: TimeSlot) => slot.isActive) // Changed from isAvailable to isActive to match API
      .sort((a: TimeSlot, b: TimeSlot) => a.startTime.localeCompare(b.startTime));
  }, [slots]);

  // Calculate total price for selected slots
  const totalPrice = useMemo(() => {
    if (selectedSlots.length === 0) return 0;
    return selectedSlots.reduce((total, slotId) => {
      const slot = availableSlots.find((s: TimeSlot) => s.id === slotId);
      return total + (slot?.rate || 0); // Changed from price to rate to match API
    }, 0);
  }, [selectedSlots, availableSlots]);

  // Format time for display
  const formatTime = (timeString: string) => {
    return format(new Date(`2000-01-01T${timeString}`), 'h:mm a');
  };

  // Handle booking submission
  const handleBookNow = useCallback(async () => {
    if (selectedSlots.length === 0 || !selectedCourtId) {
      toast.error('No time slots selected');
      return;
    }
    
    try {
      setIsBooking(true);
      
      // Create booking for each selected time slot
      const bookingPromises = selectedSlots.map(slotId => {
        return createBooking({ timeSlotId: slotId }).unwrap()
          .then(result => ({
            success: true,
            slotId,
            data: result
          }))
          .catch(error => ({
            success: false,
            slotId,
            error: error?.data?.message || 'Failed to book time slot'
          }));
      });
      
      // Wait for all bookings to complete
      const results = await Promise.all(bookingPromises);
      const successfulBookings = results.filter(r => r.success);
      const failedBookings = results.filter(r => !r.success);
      
      // Show success/error messages
      if (successfulBookings.length > 0) {
        toast.success(`Successfully booked ${successfulBookings.length} time slot(s)`);
      }
      
      if (failedBookings.length > 0) {
        toast.error(`Failed to book ${failedBookings.length} time slot(s)`);
      }
      
      // Refresh available slots after booking
      await refetchSlots();
      setSelectedSlots([]);
      
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('An error occurred while processing your booking');
    } finally {
      setIsBooking(false);
    }
  }, [selectedSlots, selectedCourtId, selectedDate, createBooking, refetchSlots, selectedCourt]);

  // Consecutive selection logic
  const handleSlotClick = useCallback((slotId: string) => {
    setSelectedSlots(current => {
      // If already selected, deselect it
      if (current.includes(slotId)) {
        return current.filter(id => id !== slotId);
      }
      
      // If first selection
      if (current.length === 0) {
        return [slotId];
      }
      
      // Only allow consecutive selection
      const currentSlot = availableSlots.find((s: TimeSlot) => s.id === slotId);
      const selectedSlot = availableSlots.find((s: TimeSlot) => s.id === current[0]);
      
      if (!currentSlot || !selectedSlot) return current;
      
      const currentTime = new Date(`2000-01-01T${currentSlot.startTime}`).getTime();
      const selectedTime = new Date(`2000-01-01T${selectedSlot.startTime}`).getTime();
      
      // If new slot is right before the first selected slot
      if (currentTime < selectedTime && 
          currentTime + 60 * 60 * 1000 === selectedTime) {
        return [slotId, ...current];
      }
      
      // If new slot is right after the last selected slot
      const lastSelected = availableSlots.find((s: TimeSlot) => s.id === current[current.length - 1]);
      if (lastSelected) {
        const lastTime = new Date(`2000-01-01T${lastSelected.endTime}`).getTime();
        if (currentTime === lastTime) {
          return [...current, slotId];
        }
      }
      
      // If not consecutive, start new selection
      return [slotId];
    });
  }, [availableSlots]);

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-6", className)}>
      <div className="lg:col-span-2">
        <Card className="border rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Book a Time Slot</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select your preferred date and time
        </p>
        
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Date</label>
            <div className="relative">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(new Date(selectedDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={new Date(selectedDate)}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(format(date, "yyyy-MM-dd"));
                        setSelectedSlots([]);
                      }
                    }}
                    className="rounded-md border"
                    disabled={(date) => {
                      // Allow all dates for testing
                      return false;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {courts.length > 1 && (
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Court</label>
              <select
                value={selectedCourtId}
                onChange={(e) => {
                  setSelectedCourtId(e.target.value);
                  setSelectedSlots([]);
                }}
                className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={isLoading}
              >
                {courts.map((court) => (
                  <option key={court.courtId} value={court.courtId}>
                    {court.name} ({court.sportCategory})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Available Time Slots</h3>
          {selectedSlots.length > 0 && (
            <div className="text-sm">
              <span className="text-muted-foreground">Selected: </span>
              <span className="font-medium">{selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''}</span>
              {totalPrice > 0 && (
                <span className="ml-2 text-green-600 font-semibold">
                  Rs. {totalPrice.toLocaleString()}
                </span>
              )}
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p>Loading available slots...</p>
          </div>
        ) : isError ? (
          <div className="py-8 text-center">
            <div className="text-red-500 mb-2">Failed to load time slots.</div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetchSlots()}
              disabled={isLoading}
            >
              {isLoading ? 'Retrying...' : 'Retry'}
            </Button>
          </div>
        ) : availableSlots.length === 0 ? (
          <div className="py-12 text-center border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">No time slots available for this date.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try selecting a different date or check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {availableSlots.map((slot: TimeSlot) => {
              const isSelected = selectedSlots.includes(slot.id);
              const isFirstSelected = selectedSlots[0] === slot.id;
              const isLastSelected = selectedSlots[selectedSlots.length - 1] === slot.id;
              
              return (
                <Button
                  key={slot.id}
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "h-14 flex flex-col items-center justify-center rounded-lg transition-all duration-150 relative overflow-hidden",
                    isSelected 
                      ? "bg-green-100 hover:bg-green-100 text-green-900 border-2 border-green-400"
                      : "hover:bg-accent/50 hover:border-accent",
                    isFirstSelected && "rounded-r-none border-r-0",
                    isLastSelected && "rounded-l-none border-l-0"
                  )}
                  onClick={() => handleSlotClick(slot.id)}
                >
                  <span className="font-medium text-sm">
                    {formatTime(slot.startTime)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Rs. {slot.price}
                  </span>
                </Button>
              );
            })}
          </div>
        )}

        {selectedSlots.length > 0 && (
          <div className="pt-4 mt-4 border-t">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Selected time:</p>
                <p className="font-medium">
                  {format(new Date(selectedDate), 'EEEE, MMM d, yyyy')} • {selectedSlots.length} hour{selectedSlots.length > 1 ? 's' : ''}
                </p>
              </div>
              <Button 
                onClick={handleBookNow}
                disabled={isBooking}
                className="px-6"
              >
                {isBooking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  `Book Now (Rs. ${totalPrice.toLocaleString()})`
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
        </Card>
      </div>
      
      {/* Booking Summary */}
      <div className="lg:sticky lg:top-6 h-fit">
        <Card className="border rounded-xl p-6">
          <CardHeader className="px-0 pt-0 pb-4">
            <CardTitle className="text-lg font-semibold">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Venue</span>
                <span className="text-sm font-medium">{selectedCourt?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Date</span>
                <span className="text-sm font-medium">
                  {selectedDate ? format(new Date(selectedDate), 'PPP') : 'Select date'}
                </span>
              </div>
              {selectedSlots.length > 0 && (
                <div className="pt-2 border-t">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Selected Slots</span>
                    <span className="text-sm font-medium">{selectedSlots.length} hour{selectedSlots.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="space-y-2">
                    {selectedSlots.map((slotId, index) => {
                      const slot = availableSlots.find((s: TimeSlot) => s.id === slotId);
                      if (!slot) return null;
                      return (
                        <div key={index} className="flex justify-between items-center bg-muted/30 p-2 rounded">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm">
                              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                            </span>
                          </div>
                          <span className="text-sm font-medium">Rs. {slot.rate}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            {selectedSlots.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Total</span>
                  <span className="text-lg font-bold text-green-600">Rs. {totalPrice.toLocaleString()}</span>
                </div>
                <Button 
                  onClick={handleBookNow}
                  disabled={isBooking}
                  className="w-full"
                  size="lg"
                >
                  {isBooking ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Book Now'
                  )}
                </Button>
              </div>
            )}
            
            {selectedSlots.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <p>Select time slots to see booking details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

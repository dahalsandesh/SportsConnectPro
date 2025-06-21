"use client";
import React, { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useGetTicketsQuery, useCreateBookingMutation } from "@/redux/api/publicApi";
import { format, addDays } from "date-fns";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price: number;
  courtId: string;
  date: string;
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

  const minDate = format(new Date(), "yyyy-MM-dd");
  const maxDate = format(addDays(new Date(), 30), "yyyy-MM-dd");

  // Filter and sort slots
  const availableSlots = useMemo(() => {
    if (!Array.isArray(slots)) return [];
    return slots
      .filter((slot: TimeSlot) => slot.isAvailable)
      .sort((a: TimeSlot, b: TimeSlot) => a.startTime.localeCompare(b.startTime));
  }, [slots]);

  // Calculate total price for selected slots
  const totalPrice = useMemo(() => {
    if (selectedSlots.length === 0) return 0;
    return selectedSlots.reduce((total, slotId) => {
      const slot = availableSlots.find((s: TimeSlot) => s.id === slotId);
      return total + (slot?.price || 0);
    }, 0);
  }, [selectedSlots, availableSlots]);

  // Format time for display
  const formatTime = (timeString: string) => {
    return format(new Date(`2000-01-01T${timeString}`), 'h:mm a');
  };

  // Handle booking submission
  const handleBookNow = useCallback(async () => {
    if (selectedSlots.length === 0 || !selectedCourtId) return;
    
    try {
      setIsBooking(true);
      // This is a placeholder - replace with your actual booking API call
      const result = await createBooking({
        courtId: selectedCourtId,
        slotIds: selectedSlots,
        date: selectedDate,
      }).unwrap();
      
      toast.success('Booking successful!', {
        description: `Your booking for ${selectedCourt?.name} is confirmed.`
      });
      
      // Refresh slots after booking
      refetchSlots();
      setSelectedSlots([]);
    } catch (error) {
      console.error('Booking failed:', error);
      toast.error('Booking failed', {
        description: 'There was an error processing your booking. Please try again.'
      });
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
    <div className={cn("border rounded-xl p-6 bg-card", className)}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Book a Time Slot</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select your preferred date and time
        </p>
        
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Date</label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                min={minDate}
                max={maxDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlots([]);
                }}
                className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <CalendarIcon className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
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
    </div>
  );
}

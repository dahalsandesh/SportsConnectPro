"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, parse, addMinutes, isWithinInterval } from "date-fns";
import { useState, useCallback, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

export interface TimeSlot {
  time: string;
  formattedTime: string;
  isSelected: boolean;
  isBooked: boolean;
  rate?: number;
}

interface TimeSlotGridProps {
  selectedDate: Date;
  courtId: string;
  existingSlots: Array<{
    startTime: string;
    endTime: string;
    rate?: number;
    isActive: boolean;
  }>;
  onSlotsSelected: (slots: Array<{ startTime: string; endTime: string; rate?: number }>) => Promise<void>;
  isLoading?: boolean;
}

export function TimeSlotGrid({ 
  selectedDate, 
  courtId, 
  existingSlots = [], 
  onSlotsSelected,
  isLoading = false
}: TimeSlotGridProps) {
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
  const [specialPrice, setSpecialPrice] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Generate time slots from 6 AM to 10 PM in 1-hour intervals
  const generateTimeSlots = useCallback(() => {
    const slots: TimeSlot[] = [];
    for (let hour = 6; hour <= 22; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      slots.push({
        time,
        formattedTime: format(parse(time, 'HH:mm', new Date()), 'h:mm a'),
        isSelected: false,
        isBooked: false
      });
    }
    return slots;
  }, []);

  // Update available slots when props change
  useEffect(() => {
    const slots = generateTimeSlots();
    const updatedSlots = slots.map(slot => {
      const isBooked = existingSlots.some(ts => {
        if (!ts.startTime || !ts.endTime) return false;
        
        const slotTime = parse(slot.time, 'HH:mm', new Date());
        const startTime = parse(ts.startTime, 'HH:mm:ss', new Date());
        const endTime = parse(ts.endTime, 'HH:mm:ss', new Date());
        
        return isWithinInterval(slotTime, {
          start: startTime,
          end: addMinutes(endTime, -1) // Exclude the end time
        }) && ts.isActive;
      });

      const existingSlot = existingSlots.find(ts => 
        ts.startTime?.startsWith(slot.time)
      );

      return {
        ...slot,
        isBooked,
        rate: existingSlot?.rate,
        isSelected: selectedSlots.some(s => s.time === slot.time)
      };
    });

    setAvailableSlots(updatedSlots);
  }, [existingSlots, generateTimeSlots, selectedSlots]);

  const toggleTimeSlot = (slot: TimeSlot) => {
    // Prevent selection of already booked or disabled slots
    if (slot.isBooked || slot.rate !== undefined) return;

    setSelectedSlots(prev => {
      const isSelected = prev.some(s => s.time === slot.time);
      if (isSelected) {
        return prev.filter(s => s.time !== slot.time);
      } else {
        return [...prev, { ...slot, isSelected: true }];
      }
    });
  };

  const handleAddSlots = async () => {
    if (selectedSlots.length === 0) {
      toast({
        title: "No slots selected",
        description: "Please select at least one time slot",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Sort selected slots by time
      const sortedSlots = [...selectedSlots].sort((a, b) => 
        a.time.localeCompare(b.time)
      );

      // Create a separate 1-hour slot for each selected time
      const newSlots = sortedSlots.map(slot => ({
        startTime: slot.time,
        endTime: format(
          addMinutes(parse(slot.time, 'HH:mm', new Date()), 60),
          'HH:mm'
        ),
        rate: specialPrice ? parseFloat(specialPrice) : undefined
      }));

      await onSlotsSelected(newSlots);
      setSelectedSlots([]);
      setSpecialPrice('');
    } catch (error) {
      console.error("Error adding slots:", error);
      toast({
        title: "Error",
        description: "Failed to add time slots",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {availableSlots.map((slot) => (
          <Button
            key={slot.time}
            variant={
              slot.isSelected 
                ? "default" 
                : slot.isBooked || slot.rate !== undefined 
                  ? "outline" 
                  : "secondary"
            }
            className={`h-12 ${(slot.isBooked || slot.rate !== undefined) ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => toggleTimeSlot(slot)}
            disabled={slot.isBooked || slot.rate !== undefined || isProcessing}
          >
            {slot.formattedTime}
            {slot.rate !== undefined && (
              <Badge variant="secondary" className="ml-2">
                ${slot.rate}
              </Badge>
            )}
          </Button>
        ))}
      </div>
      
      {selectedSlots.length > 0 && (
        <div className="mt-4 p-4 border rounded-lg bg-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-medium">
                {selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''} selected
              </h4>
              <p className="text-sm text-muted-foreground">
                {selectedSlots[0].formattedTime} - {selectedSlots[selectedSlots.length - 1].formattedTime}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Special price (optional)"
                value={specialPrice}
                onChange={(e) => setSpecialPrice(e.target.value)}
                className="w-32"
                min="0"
                step="0.01"
                disabled={isProcessing}
              />
              <Button 
                onClick={handleAddSlots}
                disabled={isProcessing}
              >
                {isProcessing ? 'Adding...' : 'Add Slots'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

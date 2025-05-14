"use client"

import { useState } from "react"
import { format, addDays } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

// Generate time slots from 6 AM to 10 PM
const generateTimeSlots = () => {
  const slots = []
  for (let hour = 6; hour <= 22; hour++) {
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12
    const period = hour < 12 ? "AM" : "PM"
    slots.push(`${formattedHour}:00 ${period}`)
  }
  return slots
}

const timeSlots = generateTimeSlots()

// Dummy availability data - in a real app, this would come from an API
const availabilityData = {
  c1: {
    "2023-04-20": ["6:00 AM", "7:00 AM", "8:00 AM", "5:00 PM", "6:00 PM", "7:00 PM"],
    "2023-04-21": ["9:00 AM", "10:00 AM", "11:00 AM", "4:00 PM", "5:00 PM"],
    "2023-04-22": ["6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "6:00 PM", "7:00 PM", "8:00 PM"],
  },
  c2: {
    "2023-04-20": ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "8:00 PM", "9:00 PM"],
    "2023-04-21": ["6:00 AM", "7:00 AM", "8:00 AM", "6:00 PM", "7:00 PM", "8:00 PM"],
    "2023-04-22": ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "5:00 PM", "6:00 PM"],
  },
}

export default function BookingCalendar({
  venueId,
  courts,
}: {
  venueId: string
  courts: any[]
}) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [court, setCourt] = useState(courts[0]?.id || "")
  const [timeSlot, setTimeSlot] = useState<string | undefined>()
  const [duration, setDuration] = useState("1")

  // For demo purposes, we'll just use the current date + 1 for available slots
  const formattedDate = date ? format(date, "yyyy-MM-dd") : ""
  const tomorrow = addDays(new Date(), 1)
  const formattedTomorrow = format(tomorrow, "yyyy-MM-dd")

  // Use dummy data or fallback to empty array
  const availableSlots =
    court && formattedDate
      ? availabilityData[court as keyof typeof availabilityData]?.[
          formattedDate as keyof (typeof availabilityData)[typeof court]
        ] ||
        availabilityData[court as keyof typeof availabilityData]?.[
          formattedTomorrow as keyof (typeof availabilityData)[typeof court]
        ] ||
        timeSlots.slice(0, 8) // Fallback to first 8 slots
      : []

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Court</label>
            <Select value={court} onValueChange={setCourt}>
              <SelectTrigger>
                <SelectValue placeholder="Select a court" />
              </SelectTrigger>
              <SelectContent>
                {courts.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} - {c.surface}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Select Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Available Time Slots</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {availableSlots.map((slot) => (
              <Button
                key={slot}
                variant={timeSlot === slot ? "default" : "outline"}
                className={timeSlot === slot ? "bg-green-600 hover:bg-green-700" : ""}
                onClick={() => setTimeSlot(slot)}
              >
                {slot}
              </Button>
            ))}
            {availableSlots.length === 0 && (
              <p className="col-span-full text-center text-gray-500 py-4">
                No available slots for the selected date and court.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Duration (hours)</label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 hour</SelectItem>
              <SelectItem value="2">2 hours</SelectItem>
              <SelectItem value="3">3 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg h-fit">
        <h3 className="text-lg font-bold mb-4">Booking Summary</h3>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-500">Venue:</span>
            <span className="font-medium">Green Field Futsal</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Court:</span>
            <span className="font-medium">
              {court ? courts.find((c) => c.id === court)?.name || "Select a court" : "Select a court"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date:</span>
            <span className="font-medium">{date ? format(date, "PPP") : "Select a date"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Time:</span>
            <span className="font-medium">{timeSlot || "Select a time slot"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Duration:</span>
            <span className="font-medium">{duration} hour(s)</span>
          </div>
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span className="text-green-600">
                Rs.{" "}
                {court && duration ? (courts.find((c) => c.id === court)?.price || 0) * Number.parseInt(duration) : 0}
              </span>
            </div>
          </div>
        </div>

        <Button className="w-full bg-green-600 hover:bg-green-700" disabled={!court || !date || !timeSlot}>
          Proceed to Payment
        </Button>
      </div>
    </div>
  )
}

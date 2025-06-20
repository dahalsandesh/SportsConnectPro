"use client"

import { useState, useEffect } from "react"
import { format, addDays, parse } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { useGetVenueBookingsQuery, useUpdateVenueBookingStatusMutation } from "@/redux/api/venue-owner/bookingApi"
import { useCreateTimeSlotsMutation } from "@/redux/api/venue-owner/timeSlotsApi"

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

interface Court {
  id: string
  name: string
  price: number
  surface: string
}

interface BookingCalendarProps {
  venueId: string
  courts: Court[]
}

export default function BookingCalendar({ venueId, courts }: BookingCalendarProps) {
  const { toast } = useToast()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [court, setCourt] = useState(courts[0]?.id || "")
  const [timeSlot, setTimeSlot] = useState<string | undefined>()
  const [duration, setDuration] = useState("1")
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch bookings for the selected court and date
  const formattedDate = date ? format(date, "yyyy-MM-dd") : ""
  const { data: courtBookings, isLoading: isLoadingBookings } = useGetVenueBookingsQuery(
    { venueId, dateFrom: formattedDate, dateTo: formattedDate },
    { skip: !court || !formattedDate }
  )

  // Create time slot mutation
  const [createTimeSlot, { isLoading: isCreatingBooking }] = useCreateTimeSlotsMutation()

  // Calculate available time slots based on existing bookings
  useEffect(() => {
    if (!court || !formattedDate || !courtBookings?.data) {
      setAvailableSlots([])
      return
    }

    try {
      setIsLoadingSlots(true)
      setError(null)

      // Get all booked slots for the selected court and date
      const bookedSlots = courtBookings.data
        .filter((booking: any) => booking.court?.courtId === court)
        .map((booking: any) => ({
          start: new Date(booking.startTime),
          end: new Date(booking.endTime),
        }))

      // Generate available slots
      const allSlots = generateTimeSlots()
      const now = new Date()
      const currentDate = new Date()
      currentDate.setHours(0, 0, 0, 0)
      
      const selectedDate = date ? new Date(date) : null
      
      const available = allSlots.filter((slot) => {
        if (!selectedDate) return false
        
        const [time, period] = slot.split(" ")
        let [hours, minutes] = time.split(":").map(Number)
        
        // Convert to 24-hour format
        if (period === "PM" && hours < 12) hours += 12
        if (period === "AM" && hours === 12) hours = 0
        
        const slotDate = new Date(selectedDate)
        slotDate.setHours(hours, minutes, 0, 0)
        
        // Check if slot is in the past (only for current date)
        const isToday = selectedDate.toDateString() === currentDate.toDateString()
        if (isToday && slotDate < now) return false
        
        // Check if slot is already booked
        return !bookedSlots.some(
          (booked: any) => slotDate >= booked.start && slotDate < booked.end
        )
      })

      setAvailableSlots(available)
    } catch (err) {
      console.error("Error calculating available slots:", err)
      setError("Failed to load available time slots. Please try again.")
      setAvailableSlots([])
    } finally {
      setIsLoadingSlots(false)
    }
  }, [court, formattedDate, courtBookings, date])
  
  // Handle booking submission
  const handleBookingSubmit = async () => {
    if (!court || !date || !timeSlot || !duration) {
      toast({
        title: "Missing information",
        description: "Please select court, date, time, and duration.",
        variant: "destructive",
      })
      return
    }

    try {
      // Parse the selected time
      const [time, period] = timeSlot.split(" ")
      let [hours, minutes] = time.split(":").map(Number)
      
      // Convert to 24-hour format
      if (period === "PM" && hours < 12) hours += 12
      if (period === "AM" && hours === 12) hours = 0
      
      const startTime = new Date(date)
      startTime.setHours(hours, minutes, 0, 0)
      
      const endTime = new Date(startTime)
      endTime.setHours(endTime.getHours() + parseInt(duration))
      
      // Create time slot payload
      const timeSlotData = {
        courtId: court,
        date: format(date, "yyyy-MM-dd"),
        startTime: format(startTime, "HH:mm:ss"),
        endTime: format(endTime, "HH:mm:ss"),
        status: "available",
        price: courts.find(c => c.id === court)?.price || 0,
        maxPlayers: 10 // Default value, adjust as needed
      }
      
      // Call the API
      const result = await createTimeSlot(timeSlotData).unwrap()
      
      // Show success message
      toast({
        title: "Time slot created!",
        description: `Your time slot for ${format(date, "PPP")} at ${timeSlot} has been created.`,
        variant: "default",
      })
      
      // Reset form
      setTimeSlot(undefined)
      
    } catch (err: any) {
      console.error("Error creating time slot:", err)
      toast({
        title: "Failed to create time slot",
        description: err.data?.message || "Failed to create time slot. Please try again.",
        variant: "destructive",
      })
    }
  }

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

        <Button 
          className="w-full bg-green-600 hover:bg-green-700" 
          onClick={handleBookingSubmit}
          disabled={!court || !date || !timeSlot || isCreatingBooking}
        >
          {isCreatingBooking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Proceed to Payment'
          )}
        </Button>
      </div>
    </div>
  )
}

"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGetTicketsQuery, useCreateBookingMutation, useGetPaymentTypesQuery } from "@/redux/api/publicApi";
import { format, addDays } from "date-fns";
import { Loader2, Calendar as CalendarIcon, Clock, CreditCard } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/store/hooks";
import { useRouter, useSearchParams } from "next/navigation";

interface TimeSlot {
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

interface PaymentType {
  PaymentTypeID: string;
  PaymentTypeName: string;
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
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>("");
  const [selectedCourtId, setSelectedCourtId] = useState<string>(defaultCourtId || (courts[0]?.courtId ?? ""));
  const [selectedDate, setSelectedDate] = useState<string>(() => format(new Date(), "yyyy-MM-dd"));
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [isBooking, setIsBooking] = useState(false);
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check for booking state in URL parameters
    const bookingStateParam = searchParams.get('bookingState');
    if (bookingStateParam) {
      try {
        const bookingState = JSON.parse(decodeURIComponent(bookingStateParam));
        
        // Restore booking state
        if (bookingState.selectedDate) {
          setSelectedDate(bookingState.selectedDate);
        }
        
        if (bookingState.selectedCourtId) {
          setSelectedCourtId(bookingState.selectedCourtId);
        }
        
        if (bookingState.selectedSlots && Array.isArray(bookingState.selectedSlots)) {
          setSelectedSlots(bookingState.selectedSlots);
        }
        
        if (bookingState.selectedPaymentType) {
          setSelectedPaymentType(bookingState.selectedPaymentType);
        }
        
        // Remove booking state from URL
        const url = new URL(window.location.href);
        url.searchParams.delete('bookingState');
        window.history.replaceState({}, '', url.toString());
      } catch (error) {
        console.error('Failed to parse booking state:', error);
      }
    }
  }, [searchParams]);
  
  const [createBooking] = useCreateBookingMutation();
  const { data: paymentTypes = [], isLoading: isLoadingPaymentTypes } = useGetPaymentTypesQuery();

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

  // Filter and sort slots
  const availableSlots = useMemo(() => {
    if (!Array.isArray(slots)) return [];
    return slots
      .filter((slot: TimeSlot) => slot.isActive)
      .sort((a: TimeSlot, b: TimeSlot) => a.startTime.localeCompare(b.startTime));
  }, [slots]);

  // Calculate the total price based on selected slots
  const totalPrice = useMemo(() => {
    if (!selectedSlots.length || !availableSlots) return 0;
    
    return selectedSlots.reduce((total, slotId) => {
      const slot = availableSlots.find((s: TimeSlot) => s.id === slotId);
      return total + (slot?.rate || 0);
    }, 0);
  }, [selectedSlots, availableSlots]);

  // Format time for display
  const formatTime = (timeString: string) => {
    return format(new Date(`2000-01-01T${timeString}`), 'h:mm a');
  };

  // Handle booking submission for multiple slots
  const handleBookNow = useCallback(async () => {
    // First check if user is authenticated
    if (!user || !user.userId) {
      // If user is not logged in, redirect to login with booking details
      const bookingState = {
        selectedSlots,
        selectedCourtId,
        selectedDate,
        selectedPaymentType,
        courtName: selectedCourt?.name || '',
        redirectUrl: window.location.pathname
      };
      
      // Encode the booking state and redirect to login
      const encodedState = encodeURIComponent(JSON.stringify(bookingState));
      router.push(`/login?redirect=${window.location.pathname}&state=${encodedState}`);
      return;
    }
    
    // Double check we have a valid user ID
    if (!user.userId) {
      toast.error('You must be logged in to make a booking');
      return;
    }

    if (selectedSlots.length === 0 || !selectedCourtId) {
      toast.error('No time slots selected');
      return;
    }

    if (!selectedPaymentType) {
      toast.error('Please select a payment method');
      return;
    }
    
    try {
      console.log('Starting booking process...');
      setIsBooking(true);
      
      // Get courtId from URL
      const courtId = window.location.pathname.split('/').pop();
      console.log('Court ID from URL:', courtId);
      
      // Get payment method name
      const paymentMethod = paymentTypes.find(pt => pt.PaymentTypeID === selectedPaymentType)?.PaymentTypeName || 'Cash';
      
      // Prepare booking data
      const bookingData = { 
        ticketIds: selectedSlots,
        paymentTypeId: selectedPaymentType,
        userId: user.userId,
        totalPrice: totalPrice,
        courtId: courtId || ''
      };
      
      console.log('Sending booking request with data:', bookingData);
      
      // Send single request with all ticket IDs
      const response = await createBooking(bookingData).unwrap();
      
      console.log('Booking API response:', response);
      
      // Check if the booking was successful
      if (response && (response.status === true || response.bookId)) {
        console.log('Booking successful, preparing confirmation data');
        
        // Prepare booking confirmation data
        const confirmationData = {
          status: response.paymentStatus?.toLowerCase() === 'pending' ? 'pending' : 'success',
          bookingId: response.bookId || 'N/A',
          amount: response.price || totalPrice,
          paymentMethod: paymentMethod,
          venueName: selectedCourt?.name || 'Unknown Venue',
          courtName: selectedCourt?.name || 'Unknown Court',
          date: selectedDate,
          timeSlots: selectedSlots.map(slotId => {
            const slot = availableSlots.find((s: TimeSlot) => s.id === slotId);
            return slot ? `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}` : '';
          }).filter(Boolean),
          message: response.paymentStatus?.toLowerCase() === 'pending' 
            ? 'Your booking is pending payment. Please complete the payment to confirm your slot.'
            : 'Your booking has been confirmed!',
        };
        
        // Store booking data in session storage
        sessionStorage.setItem('lastBooking', JSON.stringify(confirmationData));
        
        // Redirect to confirmation page with booking data
        router.push(`/booking/confirmation?booking=${encodeURIComponent(JSON.stringify(confirmationData))}`);
        
        // Refresh the slots to show them as booked
        try {
          await refetchSlots();
          console.log('Slots refreshed successfully');
        } catch (refreshError) {
          console.error('Error refreshing slots:', refreshError);
        }
        
      } else {
        // Handle case where status is not true or bookId is missing
        console.error('Unexpected booking response:', response);
        
        // Redirect to confirmation page with error state
        const errorData = {
          status: 'failed',
          bookingId: 'N/A',
          amount: totalPrice,
          paymentMethod: paymentMethod,
          venueName: selectedCourt?.name || 'Unknown Venue',
          courtName: selectedCourt?.name || 'Unknown Court',
          date: selectedDate,
          timeSlots: selectedSlots.map(slotId => {
            const slot = availableSlots.find((s: TimeSlot) => s.id === slotId);
            return slot ? `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}` : '';
          }).filter(Boolean),
          message: 'There was an issue confirming your booking. Please try again or contact support.',
        };
        
        sessionStorage.setItem('lastBooking', JSON.stringify(errorData));
        router.push(`/booking/confirmation?booking=${encodeURIComponent(JSON.stringify(errorData))}`);
      }
      
    } catch (error: any) {
      console.error('Booking error:', error);
      
      // Handle different types of errors
      const errorMessage = error?.data?.message || 
                         error?.error || 
                         (typeof error === 'string' ? error : 'Failed to process booking');
      
      // Show error toast
      toast.error(`Booking failed: ${errorMessage}`, {
        duration: 10000,
        closeButton: true,
      });
      
      // Prepare error data for confirmation page
      const errorData = {
        status: 'failed',
        bookingId: 'N/A',
        amount: totalPrice,
        paymentMethod: paymentTypes.find(pt => pt.PaymentTypeID === selectedPaymentType)?.PaymentTypeName || 'Unknown',
        venueName: selectedCourt?.name || 'Unknown Venue',
        courtName: selectedCourt?.name || 'Unknown Court',
        date: selectedDate,
        timeSlots: selectedSlots.map(slotId => {
          const slot = availableSlots.find((s: TimeSlot) => s.id === slotId);
          return slot ? `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}` : '';
        }).filter(Boolean),
        message: `Booking failed: ${errorMessage}`,
      };
      
      // Store in session storage and redirect
      sessionStorage.setItem('lastBooking', JSON.stringify(errorData));
      router.push(`/booking/confirmation?booking=${encodeURIComponent(JSON.stringify(errorData))}`);
      
      // Try to refetch slots in case of error to ensure UI is in sync
      try {
        await refetchSlots();
      } catch (refetchError) {
        console.error('Error refetching slots:', refetchError);
      }
    } finally {
      setIsBooking(false);
    }
  }, [selectedSlots, selectedCourtId, selectedDate, createBooking, refetchSlots, selectedCourt, user, selectedPaymentType, router]);

  // Handle slot selection allowing multiple selections
  const handleSlotClick = useCallback((slotId: string) => {
    setSelectedSlots(current => {
      // If already selected, deselect it
      if (current.includes(slotId)) {
        return current.filter(id => id !== slotId);
      }
      
      // Add to selection
      return [...current, slotId];
    });
  }, []);

  // Render payment types selection
  const renderPaymentTypes = () => (
    <div className="space-y-4 mt-4">
      <h4 className="font-medium">Select Payment Method</h4>
      {isLoadingPaymentTypes ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : paymentTypes.length > 0 ? (
        <RadioGroup 
          value={selectedPaymentType} 
          onValueChange={setSelectedPaymentType}
          className="space-y-2"
        >
          {paymentTypes.map((paymentType: PaymentType) => (
            <div key={paymentType.PaymentTypeID} className="flex items-center space-x-2">
              <RadioGroupItem value={paymentType.PaymentTypeID} id={`payment-${paymentType.PaymentTypeID}`} />
              <Label htmlFor={`payment-${paymentType.PaymentTypeID}`} className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                {paymentType.PaymentTypeName}
              </Label>
            </div>
          ))}
        </RadioGroup>
      ) : (
        <p className="text-sm text-muted-foreground">No payment methods available</p>
      )}
    </div>
  );

  // Render login modal
  const renderLoginModal = () => (
    <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login Required</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>You need to be logged in to book a time slot.</p>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsLoginModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                const currentUrl = window.location.pathname + window.location.search;
                router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`);
              }}
            >
              Go to Login
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-6", className)}>
      {/* Left Column - Calendar and Time Slots */}
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
                  <span className="font-medium">
                    {selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''}
                  </span>
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
                          : "hover:bg-accent/50 hover:border-accent"
                      )}
                      onClick={() => handleSlotClick(slot.id)}
                    >
                      <span className="font-medium text-sm">
                        {formatTime(slot.startTime)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Rs. {slot.rate}
                      </span>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        </Card>
      </div>
      
      {/* Right Column - Booking Summary */}
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
                    <span className="text-sm font-medium">
                      {selectedSlots.length} hour{selectedSlots.length !== 1 ? 's' : ''}
                    </span>
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
                  <span className="text-lg font-bold text-green-600">
                    Rs. {totalPrice.toLocaleString()}
                  </span>
                </div>
                
                {/* Payment Type Selection */}
                {renderPaymentTypes()}
                
                <Button 
                  onClick={handleBookNow}
                  disabled={isBooking || !selectedPaymentType}
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
      
      {/* Login Modal */}
      {renderLoginModal()}
    </div>
  );
}

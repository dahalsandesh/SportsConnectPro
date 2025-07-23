"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, AlertCircle, CreditCard, MapPin, Calendar, Clock as ClockIcon } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

type BookingStatus = 'success' | 'pending' | 'failed' | 'processing';

interface BookingConfirmationData {
  status: BookingStatus;
  bookingId: string;
  amount: number;
  paymentMethod: string;
  venueName: string;
  courtName: string;
  date: string;
  timeSlots: string[];
  message?: string;
}

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [bookingData, setBookingData] = useState<BookingConfirmationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we have booking data in URL params (for direct access)
    const bookingParam = searchParams.get('booking');
    
    if (bookingParam) {
      try {
        const data = JSON.parse(decodeURIComponent(bookingParam));
        setBookingData(data);
      } catch (error) {
        console.error('Error parsing booking data:', error);
        setBookingData({
          status: 'failed',
          bookingId: 'N/A',
          amount: 0,
          paymentMethod: 'Unknown',
          venueName: 'Unknown Venue',
          courtName: 'Unknown Court',
          date: new Date().toISOString(),
          timeSlots: [],
          message: 'Invalid booking data. Please check your booking details.'
        });
      }
    } else {
      // If no booking data in URL, check session storage
      const storedBooking = sessionStorage.getItem('lastBooking');
      if (storedBooking) {
        setBookingData(JSON.parse(storedBooking));
      } else {
        // No booking data found, redirect to home
        router.push('/');
        return;
      }
    }
    
    setIsLoading(false);
  }, [searchParams, router]);

  if (isLoading || !bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-12 w-12 rounded-full bg-gray-200 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  const { 
    status, 
    bookingId, 
    amount, 
    paymentMethod, 
    venueName, 
    courtName, 
    date, 
    timeSlots, 
    message 
  } = bookingData;

  const isSuccess = status === 'success';
  const isPending = status === 'pending';
  const isCashPayment = paymentMethod.toLowerCase() === 'cash';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="overflow-hidden">
          <CardHeader className={`${isSuccess ? 'bg-green-50' : isPending ? 'bg-yellow-50' : 'bg-red-50'} p-6`}>
            <div className="flex flex-col items-center text-center">
              {isSuccess ? (
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              ) : isPending ? (
                <Clock className="h-16 w-16 text-yellow-500 mb-4" />
              ) : (
                <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
              )}
              
              <h1 className="text-2xl font-bold text-gray-900">
                {isSuccess 
                  ? 'Booking Confirmed!'
                  : isPending 
                    ? 'Booking Pending'
                    : 'Booking Failed'}
              </h1>
              
              <p className="mt-2 text-gray-600">
                {isSuccess 
                  ? `Your booking #${bookingId} has been confirmed.`
                  : isPending
                    ? `Your booking #${bookingId} is being processed.`
                    : message || 'There was an issue processing your booking.'}
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Booking Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Booking Details</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{venueName}</p>
                      <p className="text-sm text-gray-500">{courtName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                      </p>
                      <div className="mt-1 space-y-1">
                        {timeSlots.map((slot, index) => (
                          <p key={index} className="text-sm text-gray-500">
                            {slot}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Information */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h2>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-500">Payment Method</span>
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {paymentMethod}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-2 border-t border-gray-200 mt-3">
                    <span className="text-base font-medium text-gray-900">Total Amount</span>
                    <span className="text-base font-bold text-gray-900">
                      Rs. {amount.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                {isCashPayment && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <ClockIcon className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Payment at Venue</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            Please pay the amount at the venue before your booking time.
                            Your booking will be confirmed once payment is received.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {!isSuccess && !isPending && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Booking Issue</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>
                            {message || 'There was an issue with your booking. Please try again or contact support.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Actions */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button 
                  asChild 
                  className="w-full sm:w-auto text-white"
                >
                  <Link href="/dashboard/bookings">
                    View My Bookings
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto"
                  asChild
                >
                  <Link href="/">
                    Back to Home
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Help Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Need help with your booking?</h2>
          <p className="text-sm text-gray-600 mb-4">
            If you have any questions or need to make changes to your booking, please contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" size="sm" asChild>
              <a href="mailto:support@sportsconnect.com">Email Support</a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="tel:+9771234567890">Call +977 1234567890</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

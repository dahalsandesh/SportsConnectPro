"use client";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MapEmbed from "@/components/map-embed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetVenueByIdQuery } from "@/redux/api/publicApi";
import CourtCard from "@/components/court-card";
import PublicBookingCalendar from "@/components/public-booking-calendar";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Configure NProgress
NProgress.configure({ showSpinner: false });

export default function VenueDetailsClient({ venueId }: { venueId: string }) {
  const router = useRouter();
  const { data: venue, isLoading, isError } = useGetVenueByIdQuery(venueId);
  
  // Handle loading state with NProgress
  useEffect(() => {
    if (isLoading) {
      NProgress.start();
    } else {
      NProgress.done();
    }
    
    return () => {
      NProgress.done();
    };
  }, [isLoading]);
  const fallbackVenueImages = [
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
  ];
  const fallbackCourtImage = "/placeholder.svg?height=300&width=400";

  // Extract venue data or use defaults
  const venueData = venue || {};
  const venueImages = venueData.venueImages?.length > 0
    ? venueData.venueImages.map((img: any) => img.image)
    : fallbackVenueImages;
  const courts = venueData.courts || [];

  // Initialize state at the top level
  const [selectedCourtId, setSelectedCourtId] = useState<string>('');
  
  // Update selectedCourtId when courts data is available
  useEffect(() => {
    if (courts.length > 0) {
      const firstCourtId = courts[0]?.courtId || courts[0]?.courtID || '';
      setSelectedCourtId(firstCourtId);
    }
  }, [courts]);

  const courtOptions = useMemo(() => 
    courts.map(court => ({
      courtId: court.courtId || court.courtID || court.id, // Handle multiple possible ID fields
      name: court.name,
      sportCategory: court.sportCategory,
      hourlyRate: court.hourlyRate || court.rate || 1000, // Default to 1000 if not provided
      id: court.courtId || court.courtID || court.id // Ensure id is set for the API
    })),
    [courts]
  );

  if (isError || !venue) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Failed to load venue details</h2>
        <p className="text-muted-foreground">Please try again later</p>
        <Button onClick={() => router.refresh()} variant="outline">
          Retry
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-green-600">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link href="/venues" className="hover:text-green-600">
          Venues
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span>{venue.name}</span>
      </div>

      {/* Venue Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{venue.name}</h1>
          <div className="flex items-center mt-2 text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{venue.address}</span>
          </div>
          <div className="flex items-center mt-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 text-yellow-400" />
              <span className="font-semibold text-lg">{venue.rating || '4.5'}</span>
              <span className="ml-1 text-gray-400">({venue.reviews || 0} reviews)</span>
            </div>
          </div>
          {venue.phoneNumber && (
            <div className="flex items-center mt-2 text-gray-500">
              <Phone className="h-4 w-4 mr-1" />
              <span>{venue.phoneNumber}</span>
            </div>
          )}
          <div className="flex items-center mt-2 text-gray-500">
            <Mail className="h-4 w-4 mr-1" />
            <span>{venue.email || 'N/A'}</span>
          </div>
        </div>
        <div className="w-full md:w-2/3 grid grid-cols-2 gap-2">
          {venueImages.map((img: string, idx: number) => (
            <div key={idx} className="relative h-40 w-full rounded-lg overflow-hidden">
              <Image src={img} alt={venue.name} fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Venue Tabs: Info, Courts, Booking */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList>
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="courts">Courts</TabsTrigger>
          <TabsTrigger value="booking">Booking</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
      <div className="mb-4">
  <MapEmbed 
    lat={typeof venue.latitude === 'number' ? venue.latitude : 27.7 + Math.random() * 0.2}
    lng={typeof venue.longitude === 'number' ? venue.longitude : 85.3 + Math.random() * 0.2}
  />
</div>
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">About</h2>
            <p className="text-muted-foreground mb-4">{venue.description || 'No description available.'}</p>
            <div className="flex flex-wrap gap-4">
              {venue.openingTime && venue.closingTime && (
                <div>
                  <span className="font-semibold">Open:</span> {venue.openingTime} - {venue.closingTime}
                </div>
              )}
              {venue.address && (
                <div>
                  <span className="font-semibold">Address:</span> {venue.address}
                </div>
              )}
              {venue.city && (
                <div>
                  <span className="font-semibold">City:</span> {venue.city}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="courts">
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-4">Courts</h2>
            {courts.length === 0 ? (
              <div className="text-muted-foreground">No courts available for this venue.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courts.map((court: any, idx: number) => (
                  <Link key={court.courtID || court.id || idx} href={`/courts/${court.courtID || court.id}`}>
                    <CourtCard court={court} fallbackImage={fallbackCourtImage} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="booking" className="mt-6">
          <div className="space-y-6">
            {courts.length > 1 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Court</label>
                <select
                  value={selectedCourtId}
                  onChange={(e) => setSelectedCourtId(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {courts.map((court) => {
                    const courtId = court.courtId || court.courtID;
                    return (
                      <option key={courtId} value={courtId}>
                        {court.name} ({court.sportCategory})
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
            {selectedCourtId ? (
              <PublicBookingCalendar 
                courts={courtOptions} 
                defaultCourtId={selectedCourtId}
                className="mt-4"
              />
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Select a court to view availability</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

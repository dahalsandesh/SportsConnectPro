"use client";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingCalendar from "@/components/booking-calendar";
import { useGetVenueByIdQuery } from "@/redux/api/publicApi";
import CourtCard from "@/components/court-card";

export default function VenueDetailsClient({ venueId }: { venueId: string }) {
  const { data: venue, isLoading, isError } = useGetVenueByIdQuery(venueId);
  const fallbackVenueImages = [
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
  ];
  const fallbackCourtImage = "/placeholder.svg?height=300&width=400";

  if (isLoading) return <div>Loading venue details...</div>;
  if (isError || !venue) return <div>Failed to load venue details.</div>;

  const venueImages =
    venue.venueImages && venue.venueImages.length > 0
      ? venue.venueImages.map((img: any) => img.image)
      : fallbackVenueImages;

  const courts = venue.courts || [];

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
          <div className="flex items-center mt-2 text-gray-500">
            <Phone className="h-4 w-4 mr-1" />
            <span>{venue.phone || 'N/A'}</span>
          </div>
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
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">About</h2>
            <p className="text-muted-foreground mb-4">{venue.description || 'No description available.'}</p>
            <div className="flex flex-wrap gap-4">
              <div>
                <span className="font-semibold">Surface:</span> {venue.surfaceType || 'N/A'}
              </div>
              <div>
                <span className="font-semibold">Capacity:</span> {venue.capacity || 'N/A'}
              </div>
              <div>
                <span className="font-semibold">Open:</span> {venue.openingTime || '6:00 AM'} - {venue.closingTime || '10:00 PM'}
              </div>
              <div>
                <span className="font-semibold">Price:</span> Rs. {venue.pricePerHour || venue.price || 'N/A'} / hour
              </div>
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
        <TabsContent value="booking">
          <div className="mt-4">
            <BookingCalendar venueId={venueId} courts={courts} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

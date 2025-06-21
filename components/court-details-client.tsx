"use client";
import Image from "next/image";
import Link from "next/link";
import { useGetCourtByIdQuery } from "@/redux/api/publicApi";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MapEmbed from "@/components/map-embed";
import PublicBookingCalendar from "@/components/public-booking-calendar";
import { Users, Clock } from "lucide-react";

export default function CourtDetailsClient({ courtId }: { courtId: string }) {
  const { data: court, isLoading, isError } = useGetCourtByIdQuery(courtId);
  const fallbackImage =
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=300&fit=crop&crop=center";

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !court) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Failed to load court details. Please try again later.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded text-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const images = court?.courtImages?.length > 0 ? court.courtImages : [{ image: fallbackImage }];
  const venue = court.venue || {};

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/venues" className="text-muted-foreground hover:text-green-600">&larr; Back to Venues</Link>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <div className="grid grid-cols-1 gap-4">
            {images.map((img: any, idx: number) => (
              <div key={idx} className="relative h-64 w-full rounded-lg overflow-hidden">
                <Image src={img.image} alt={court.name} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="md:w-1/2">
          <Card className="mb-4">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="booking">Booking</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="p-4">
                <div className="mb-4 h-64 rounded-lg overflow-hidden">
                  <MapEmbed 
                    lat={court.latitude || venue.latitude || 27.7 + Math.random() * 0.2}
                    lng={court.longitude || venue.longitude || 85.3 + Math.random() * 0.2}
                    name={court.name}
                    address={venue.address}
                  />
                </div>
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold text-foreground">{court.name}</h1>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-green-600 text-green-600 bg-green-50 dark:bg-green-950">
                      {court.sportCategory}
                    </Badge>
                    <Badge variant="outline" className="border-green-600 text-green-600 bg-green-50 dark:bg-green-950">
                      {court.surfaceType}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Capacity: {court.capacity || 'N/A'} players</span>
                    </div>
                    {venue.name && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>Venue: {venue.name}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Created: {court.createdAt ? new Date(court.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-green-600 font-bold text-2xl">Rs. {court.hourlyRate}</span>
                    <span className="ml-2 text-muted-foreground">/hour</span>
                  </div>
                  <div>
                    <Badge className={court.isActive ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'}>
                      {court.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="booking" className="p-4">
                <PublicBookingCalendar courts={[court]} defaultCourtId={courtId} />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}

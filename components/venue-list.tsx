"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Users, Clock, Navigation } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetVenuesQuery } from "@/redux/api/publicApi";

interface Venue {
  venueID: string;
  name: string;
  venueImages: Array<{ image: string }>;
  address?: string;
  city?: string;
  openingTime?: string | null;
  closingTime?: string | null;
  description?: string;
  rating?: number;
  reviews?: number;
}

interface VenueListProps {
  venues: Array<{
    venueID: string;
    name: string;
    venueImages: Array<{ image: string }>;
    rating?: number;
    reviews?: number;
    location?: string;
    city?: string;
    pricePerHour?: number;
    price?: number;
    openingTime?: string;
    closingTime?: string;
    address?: string;
    capacity?: number;
    surface?: string;
    distance?: number;
  }>;
}

export default function VenueList({ venues = [] }: VenueListProps) {
  // Fallback images from the old static data
  const fallbackImages = [
    "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=400&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop&crop=center",
  ];

  if (venues.length === 0) {
    return <div className="text-center py-8">No venues found matching your criteria.</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {venues.map((venue: Venue, i: number) => {
        const image =
          venue.venueImages && venue.venueImages.length > 0
            ? venue.venueImages[0].image
            : "/placeholder.svg";
        return (
          <Link href={`/venues/${venue.venueID}`} key={venue.venueID}>
            <Card className="overflow-hidden h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-xl bg-card border-border">
              <div className="relative h-48">
                <Image
                  src={image}
                  alt={venue.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <Badge 
                  variant="outline" 
                  className="text-xs bg-primary/10 hover:bg-primary/20 absolute top-2 left-2"
                >
                  View Venue
                </Badge>
                <div className="absolute top-2 right-2">
                  <Badge className="bg-green-600 text-white border-0 shadow-md">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    {venue.rating || 4.5} ({venue.reviews || 0})
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  {venue.name}
                </h3>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{venue.city || 'N/A'}</span>
                  </div>
                  {typeof venue.distance === 'number' && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Navigation className="h-3 w-3" />
                      {venue.distance.toFixed(1)} km away
                    </div>
                  )}
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">
                    {venue.openingTime && venue.closingTime 
                      ? `${venue.openingTime} - ${venue.closingTime}` 
                      : 'Check availability'}
                  </span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    {venue.city || ''}
                  </div>
                  {/* <Badge
                    variant="outline"
                    className="border-green-600 text-green-600 bg-green-50 dark:bg-green-950">
                    {venue.surface || "N/A"}
                  </Badge> */}
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

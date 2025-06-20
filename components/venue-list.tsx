"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Users, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetVenuesQuery } from "@/redux/api/publicApi";

interface Venue {
  venueID: string;
  name: string;
  venueImages: Array<{ image: string }>;
  rating?: number;
  reviews?: number;
  location?: string;
  city?: string;
  pricePerHour?: number;
  price?: number; // Some components might use price instead of pricePerHour
  openingTime?: string;
  closingTime?: string;
  address?: string; // For location display
  capacity?: number; // For venue capacity
  surface?: string; // Court surface type
}

export default function VenueList() {
  const { data: venues = [], isLoading, isError } = useGetVenuesQuery();
  
  // Fallback images from the old static data
  const fallbackImages = [
    "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=400&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop&crop=center",
  ];

  if (isLoading) return <div className="text-center py-8">Loading venues...</div>;
  if (isError) return <div className="text-center py-8 text-red-600">Failed to load venues. Please try again later.</div>;
  
  // Type guard to ensure venues is an array before mapping
  if (!Array.isArray(venues)) {
    return <div className="text-center py-8">No venues available</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {venues.map((venue: Venue, i: number) => {
        const image =
          venue.venueImages && venue.venueImages.length > 0
            ? venue.venueImages[0].image
            : fallbackImages[i % fallbackImages.length] || "/placeholder.svg";
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
                <div className="flex items-center text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{venue.address}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{venue.capacity || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                      {venue.openingTime || "N/A"} -{" "}
                      {venue.closingTime || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <span className="text-green-600 font-bold text-lg">
                      Rs. {venue.price || "N/A"}
                    </span>
                    <span className="text-muted-foreground text-sm">/hour</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-green-600 text-green-600 bg-green-50 dark:bg-green-950">
                    {venue.surface || "N/A"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

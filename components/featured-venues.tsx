"use client"
import Image from "next/image"
import Link from "next/link"
import { getImageUrl } from "@/lib/image-utils";
import { MapPin, Star, Users, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGetVenuesQuery } from "@/redux/api/publicApi"

// Fallback images in case venue doesn't have an image
const fallbackImages = [
  "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=400&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop&crop=center",
]

export default function FeaturedVenues() {
  const { data: venues = [], isLoading, isError } = useGetVenuesQuery()
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-muted rounded-lg h-96 w-full"></div>
        ))}
      </div>
    )
  }

  // Show error state
  if (isError) {
    return (
      <div className="text-center py-8 text-destructive">
        Failed to load venues. Please try again later.
      </div>
    )
  }

  // If no venues are available
  if (!venues || venues.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No venues available at the moment.
      </div>
    )
  }

  // Get the first 3 venues (or all if less than 3)
  const featuredVenues = venues.slice(0, 3)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredVenues.map((venue, index) => {
        // Use venue image if available, otherwise use fallback
        const imageUrl = venue.venueImages?.[0]?.image ?
          getImageUrl(venue.venueImages[0].image) :
          (fallbackImages[index % fallbackImages.length] || "/placeholder.svg");
                        
        return (
          <Link href={`/venues/${venue.venueID}`} key={venue.venueID}>
            <Card className="overflow-hidden h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-xl bg-card border-border">
              <div className="relative h-48">
                <Image
                  src={imageUrl}
                  alt={venue.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* <div className="absolute top-2 left-2">
                  <Badge variant="outline" className="text-xs bg-primary/10 hover:bg-primary/20">
                    View Venue
                  </Badge>
                </div> */}
                <div className="absolute top-2 right-2">
                  <Badge className="bg-green-600 text-white border-0 shadow-md">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    {venue.rating || '4.5'} ({venue.reviews || 0})
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-bold mb-2 text-foreground">{venue.name}</h3>
                <div className="flex items-center text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{venue.address || ''}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {/* <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    {/* <span>{venue.capacity || 'N/A'}</span> */}
                  {/* </div>  */}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                      {venue.openingTime ? `${venue.openingTime} - ${venue.closingTime || ''}` : 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    {venue.city || ''}
                  </div>
                  {venue.surfaceType && (
                    <Badge variant="outline" className="border-green-600 text-green-600 bg-green-50 dark:bg-green-950">
                      {venue.surfaceType}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
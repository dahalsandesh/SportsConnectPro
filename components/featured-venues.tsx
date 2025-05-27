"use client"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Star, Users, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Real venue data with actual images
const venues = [
  {
    id: "1",
    name: "Green Field Futsal Arena",
    address: "123 Sports Avenue, Kathmandu",
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop&crop=center",
    surface: "Artificial Grass",
    capacity: "5v5",
    price: 1200,
    openTime: "6:00 AM",
    closeTime: "10:00 PM",
  },
  {
    id: "2",
    name: "Urban Kicks Arena",
    address: "45 Central Street, Pokhara",
    rating: 4.6,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop&crop=center",
    surface: "Artificial Grass",
    capacity: "5v5",
    price: 1500,
    openTime: "7:00 AM",
    closeTime: "11:00 PM",
  },
  {
    id: "3",
    name: "Victory Futsal Court",
    address: "78 Goal Road, Lalitpur",
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=400&h=300&fit=crop&crop=center",
    surface: "Premium Wood",
    capacity: "5v5",
    price: 1800,
    openTime: "6:00 AM",
    closeTime: "12:00 AM",
  },
]

export default function FeaturedVenues() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {venues.map((venue) => (
        <Link href={`/venues/${venue.id}`} key={venue.id}>
          <Card className="overflow-hidden h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-xl bg-card border-border">
            <div className="relative h-48">
              <Image
                src={venue.image || "/placeholder.svg"}
                alt={venue.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-2 right-2">
                <Badge className="bg-green-600 text-white border-0 shadow-md">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  {venue.rating} ({venue.reviews})
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="text-xl font-bold mb-2 text-foreground">{venue.name}</h3>
              <div className="flex items-center text-muted-foreground mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{venue.address}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{venue.capacity}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    {venue.openTime} - {venue.closeTime}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <span className="text-green-600 font-bold text-lg">Rs. {venue.price}</span>
                  <span className="text-muted-foreground text-sm">/hour</span>
                </div>
                <Badge variant="outline" className="border-green-600 text-green-600 bg-green-50 dark:bg-green-950">
                  {venue.surface}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

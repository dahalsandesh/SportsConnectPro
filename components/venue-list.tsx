import Image from "next/image"
import Link from "next/link"
import { MapPin, Star, Users, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Dummy data for venues
const venues = [
  {
    id: "1",
    name: "Green Field Futsal",
    address: "123 Sports Avenue, Kathmandu",
    rating: 4.8,
    reviews: 124,
    image: "/placeholder.svg?height=300&width=400",
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
    image: "/placeholder.svg?height=300&width=400",
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
    image: "/placeholder.svg?height=300&width=400",
    surface: "Wood",
    capacity: "5v5",
    price: 1800,
    openTime: "6:00 AM",
    closeTime: "12:00 AM",
  },
  {
    id: "4",
    name: "Premier Futsal Zone",
    address: "32 Stadium Lane, Bhaktapur",
    rating: 4.7,
    reviews: 112,
    image: "/placeholder.svg?height=300&width=400",
    surface: "Concrete",
    capacity: "5v5",
    price: 1300,
    openTime: "7:00 AM",
    closeTime: "10:00 PM",
  },
  {
    id: "5",
    name: "Champions Futsal Hub",
    address: "15 Victory Road, Kathmandu",
    rating: 4.5,
    reviews: 87,
    image: "/placeholder.svg?height=300&width=400",
    surface: "Artificial Grass",
    capacity: "5v5",
    price: 1400,
    openTime: "6:00 AM",
    closeTime: "11:00 PM",
  },
  {
    id: "6",
    name: "Goal Masters Arena",
    address: "56 Sports Complex, Pokhara",
    rating: 4.8,
    reviews: 143,
    image: "/placeholder.svg?height=300&width=400",
    surface: "Wood",
    capacity: "5v5",
    price: 1600,
    openTime: "7:00 AM",
    closeTime: "12:00 AM",
  },
]

export default function VenueList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {venues.map((venue) => (
        <Link href={`/venues/${venue.id}`} key={venue.id}>
          <Card className="overflow-hidden h-full transition-transform hover:scale-[1.02]">
            <div className="relative h-48">
              <Image src={venue.image || "/placeholder.svg"} alt={venue.name} fill className="object-cover" />
              <div className="absolute top-2 right-2">
                <Badge className="bg-green-600">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  {venue.rating} ({venue.reviews})
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="text-xl font-bold mb-2">{venue.name}</h3>
              <div className="flex items-center text-gray-500 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{venue.address}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-1 text-gray-500" />
                  <span>{venue.capacity}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                  <span>
                    {venue.openTime} - {venue.closeTime}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <span className="text-green-600 font-bold">Rs. {venue.price}</span>
                  <span className="text-gray-500 text-sm">/hour</span>
                </div>
                <Badge variant="outline" className="border-green-600 text-green-600">
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

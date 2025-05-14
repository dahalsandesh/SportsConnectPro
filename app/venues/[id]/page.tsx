import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone, Mail, Clock, Star, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BookingCalendar from "@/components/booking-calendar"

// Dummy venue data
const venue = {
  id: "1",
  name: "Green Field Futsal",
  address: "123 Sports Avenue, Kathmandu",
  phone: "+977 9812345678",
  email: "info@greenfieldfutsal.com",
  description:
    "Green Field Futsal offers state-of-the-art artificial grass courts for the ultimate futsal experience. Our venue features modern amenities, changing rooms, and a cafeteria for players and spectators.",
  rating: 4.8,
  reviews: 124,
  openTime: "6:00 AM",
  closeTime: "10:00 PM",
  images: [
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
  ],
  courts: [
    {
      id: "c1",
      name: "Court A",
      surface: "Artificial Grass",
      capacity: "5v5",
      price: 1200,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "c2",
      name: "Court B",
      surface: "Artificial Grass",
      capacity: "5v5",
      price: 1200,
      image: "/placeholder.svg?height=300&width=400",
    },
  ],
  amenities: ["Changing Rooms", "Showers", "Parking", "Cafeteria", "Water Dispenser", "First Aid Kit"],
  location: {
    lat: 27.7172,
    lng: 85.324,
  },
}

export default function VenueDetailPage({ params }: { params: { id: string } }) {
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
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 font-medium">{venue.rating}</span>
            </div>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-500">{venue.reviews} reviews</span>
          </div>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">Book Now</Button>
      </div>

      {/* Venue Images */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="md:col-span-2 md:row-span-2">
          <Image
            src={venue.images[0] || "/placeholder.svg"}
            alt={venue.name}
            width={800}
            height={600}
            className="rounded-lg object-cover w-full h-full"
          />
        </div>
        {venue.images.slice(1, 4).map((image, index) => (
          <div key={index}>
            <Image
              src={image || "/placeholder.svg"}
              alt={`${venue.name} ${index + 1}`}
              width={400}
              height={300}
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
        ))}
      </div>

      {/* Venue Details Tabs */}
      <Tabs defaultValue="info" className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info">Information</TabsTrigger>
          <TabsTrigger value="courts">Courts</TabsTrigger>
          <TabsTrigger value="booking">Book a Court</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold mb-4">About {venue.name}</h2>
              <p className="text-gray-700 mb-6">{venue.description}</p>

              <h3 className="text-lg font-bold mb-3">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
                {venue.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <div className="h-2 w-2 bg-green-600 rounded-full mr-2"></div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-bold mb-3">Opening Hours</h3>
              <div className="flex items-center text-gray-700 mb-6">
                <Clock className="h-5 w-5 mr-2 text-gray-500" />
                <span>
                  {venue.openTime} - {venue.closeTime}, Every day
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-gray-500" />
                  <span>{venue.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-gray-500" />
                  <span>{venue.email}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-gray-500" />
                  <span>{venue.address}</span>
                </div>
              </div>

              <div className="mt-6 h-48 bg-gray-200 rounded-lg">
                {/* Map placeholder - would be replaced with actual map component */}
                <div className="h-full w-full flex items-center justify-center text-gray-500">Map View</div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="courts" className="mt-6">
          <h2 className="text-xl font-bold mb-6">Available Courts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {venue.courts.map((court) => (
              <div key={court.id} className="border rounded-lg overflow-hidden">
                <div className="relative h-48">
                  <Image src={court.image || "/placeholder.svg"} alt={court.name} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{court.name}</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Surface</p>
                      <p className="font-medium">{court.surface}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Capacity</p>
                      <p className="font-medium">{court.capacity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-medium text-green-600">Rs. {court.price}/hour</p>
                    </div>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700">Book This Court</Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="booking" className="mt-6">
          <h2 className="text-xl font-bold mb-6">Book a Court</h2>
          <BookingCalendar venueId={params.id} courts={venue.courts} />
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Reviews</h2>
            <Button variant="outline">Write a Review</Button>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">Overall Rating</h3>
                <div className="flex items-center mt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(venue.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 font-medium">{venue.rating}</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-gray-500">{venue.reviews} reviews</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Rating categories */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="w-32 text-sm">Court Quality</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-600 rounded-full" style={{ width: "90%" }}></div>
                  </div>
                  <span className="ml-2 text-sm font-medium">4.5</span>
                </div>
                <div className="flex items-center">
                  <span className="w-32 text-sm">Facilities</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-600 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                  <span className="ml-2 text-sm font-medium">4.3</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="w-32 text-sm">Value for Money</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-600 rounded-full" style={{ width: "80%" }}></div>
                  </div>
                  <span className="ml-2 text-sm font-medium">4.0</span>
                </div>
                <div className="flex items-center">
                  <span className="w-32 text-sm">Staff</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-600 rounded-full" style={{ width: "95%" }}></div>
                  </div>
                  <span className="ml-2 text-sm font-medium">4.8</span>
                </div>
              </div>
            </div>
          </div>

          {/* Review list placeholder */}
          <div className="space-y-6">
            <p className="text-gray-500 text-center py-8">
              Reviews will be displayed here. This would include user comments, ratings, and dates.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

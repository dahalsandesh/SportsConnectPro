import Link from "next/link"
import Image from "next/image"
import { Search, ArrowRight, Calendar, Trophy, Users, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import FeaturedVenues from "@/components/featured-venues"
import HowItWorks from "@/components/how-it-works"
import Testimonials from "@/components/testimonials"
import HeaderCarousel from "@/components/header-carousel"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section with Carousel */}
      <HeaderCarousel />

      {/* Search Section */}
      <section className="relative z-10 bg-white">
        <div className="container mx-auto px-4 -mt-16">
          <div className="bg-white rounded-xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Find Your Perfect Court</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input type="text" placeholder="Search by venue name" className="pl-10 h-12" />
              </div>
              <div className="relative flex-grow">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input type="text" placeholder="Location" className="pl-10 h-12" />
              </div>
              <div className="relative flex-grow">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input type="date" className="pl-10 h-12" />
              </div>
              <Button className="h-12 px-8 bg-green-600 hover:bg-green-700">Find Courts</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-green-600 text-4xl font-bold mb-2">150+</div>
              <div className="text-gray-600">Venues</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-green-600 text-4xl font-bold mb-2">10,000+</div>
              <div className="text-gray-600">Happy Players</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-green-600 text-4xl font-bold mb-2">25,000+</div>
              <div className="text-gray-600">Bookings</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-green-600 text-4xl font-bold mb-2">4.8</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Venues */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Venues</h2>
            <Link href="/venues">
              <Button variant="outline" className="gap-2">
                View All Venues <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <FeaturedVenues />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <HowItWorks />
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <Link href="/events">
              <Button variant="outline" className="gap-2">
                View All Events <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((event) => (
              <div
                key={event}
                className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <Image src="/placeholder.svg?height=300&width=500" alt="Event" fill className="object-cover" />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-green-600">Tournament</Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">Summer Futsal Championship {event}</h3>
                  <div className="flex items-center text-gray-500 mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm">June 15-20, 2023</span>
                  </div>
                  <div className="flex items-center text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">Green Field Futsal, Kathmandu</span>
                  </div>
                  <div className="flex items-center text-gray-500 mb-4">
                    <Trophy className="h-4 w-4 mr-1" />
                    <span className="text-sm">Prize Pool: Rs. 50,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="text-sm text-gray-500">16 Teams</span>
                    </div>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Register
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">What Our Users Say</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what players and venue owners have to say about FutsalConnectPro.
          </p>
          <Testimonials />
        </div>
      </section>

      {/* Featured in */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl font-medium text-gray-600 mb-8">As Featured In</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {[1, 2, 3, 4, 5].map((logo) => (
              <div key={logo} className="grayscale hover:grayscale-0 transition-all">
                <Image
                  src="/placeholder-logo.svg"
                  alt="Partner logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Play?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of players who book futsal courts through FutsalConnectPro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/venues">
              <Button size="lg" className="bg-white text-green-700 hover:bg-gray-100 px-8">
                Find a Court
              </Button>
            </Link>
            <Link href="/register-venue">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-green-800 px-8">
                Register Your Venue
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* App Download */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Download Our Mobile App</h2>
              <p className="text-gray-600 mb-6">
                Book courts, join events, and manage your bookings on the go with our mobile app.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-black hover:bg-gray-800 gap-2">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.5,2H8.5L3,7.5v9L8.5,22h9l5.5-5.5v-9L17.5,2z M12,17.5c-3.038,0-5.5-2.462-5.5-5.5s2.462-5.5,5.5-5.5s5.5,2.462,5.5,5.5S15.038,17.5,12,17.5z" />
                  </svg>
                  App Store
                </Button>
                <Button className="bg-black hover:bg-gray-800 gap-2">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,3v18h18V3H3z M13.5,12.5l-3,1.7v-3.4L13.5,12.5z" />
                  </svg>
                  Google Play
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-64 h-96">
                <Image
                  src="/placeholder.svg?height=600&width=300"
                  alt="Mobile App"
                  fill
                  className="object-cover rounded-3xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

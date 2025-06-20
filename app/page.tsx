import Link from "next/link"
import Image from "next/image"
import { Search, ArrowRight, Calendar, Trophy, Users, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import FeaturedVenues from "@/components/featured-venues"
import FeaturedCourts from "@/components/featured-courts"
import HowItWorks from "@/components/how-it-works"
import Testimonials from "@/components/testimonials"
import HeaderCarousel from "@/components/header-carousel"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section with Carousel */}
      <HeaderCarousel />

      {/* Search Section */}
      <section className="relative z-10 bg-background">
        <div className="container mx-auto px-4 -mt-16">
          <div className="bg-card rounded-xl shadow-2xl p-6 border border-border">
            <h2 className="text-2xl font-bold mb-4 text-center text-foreground">Find Your Perfect Court</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by venue name"
                  className="pl-10 h-12 bg-background text-foreground"
                />
              </div>
              <div className="relative flex-grow">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input type="text" placeholder="Location" className="pl-10 h-12 bg-background text-foreground" />
              </div>
              <div className="relative flex-grow">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input type="date" className="pl-10 h-12 bg-background text-foreground" />
              </div>
              <Button className="h-12 px-8 bg-green-600 hover:bg-green-700 text-white">Find Courts</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-card p-6 rounded-lg shadow-md border border-border">
              <div className="text-green-600 text-4xl font-bold mb-2">150+</div>
              <div className="text-muted-foreground">Venues</div>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md border border-border">
              <div className="text-green-600 text-4xl font-bold mb-2">10,000+</div>
              <div className="text-muted-foreground">Happy Players</div>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md border border-border">
              <div className="text-green-600 text-4xl font-bold mb-2">25,000+</div>
              <div className="text-muted-foreground">Bookings</div>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md border border-border">
              <div className="text-green-600 text-4xl font-bold mb-2">4.8</div>
              <div className="text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Venues */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Featured Venues</h2>
            <Link href="/venues">
              <Button variant="outline" className="gap-2 border-border text-foreground hover:bg-accent">
                View All Venues <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <FeaturedVenues />
        </div>
      </section>

      {/* Featured Courts */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Featured Courts</h2>
            <Link href="/courts">
              <Button variant="outline" className="gap-2 border-border text-foreground hover:bg-accent">
                View All Courts <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          {/* Courts grid */}
          <FeaturedCourts />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">How It Works</h2>
          <HowItWorks />
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Upcoming Events</h2>
            <Link href="/events">
              <Button variant="outline" className="gap-2 border-border text-foreground hover:bg-accent">
                View All Events <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: 1,
                title: "Summer Futsal Championship",
                image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=300&fit=crop&crop=center",
                date: "June 15-20, 2024",
                location: "Green Field Futsal, Kathmandu",
                prize: "Rs. 50,000",
                teams: 16,
              },
              {
                id: 2,
                title: "Corporate League",
                image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&h=300&fit=crop&crop=center",
                date: "July 5-30, 2024",
                location: "Urban Kicks Arena, Pokhara",
                prize: "Rs. 75,000",
                teams: 12,
              },
              {
                id: 3,
                title: "Women's Futsal Cup",
                image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=300&fit=crop&crop=center",
                date: "August 12-14, 2024",
                location: "Victory Futsal Court, Lalitpur",
                prize: "Rs. 40,000",
                teams: 8,
              },
            ].map((event) => (
              <div
                key={event.id}
                className="bg-card border border-border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <Image src={event.image || "/placeholder.svg"} alt="Event" fill className="object-cover" />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-green-600 text-white">Tournament</Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2 text-foreground">{event.title}</h3>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground mb-4">
                    <Trophy className="h-4 w-4 mr-1" />
                    <span className="text-sm">Prize Pool: {event.prize}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{event.teams} Teams</span>
                    </div>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
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
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-foreground">What Our Users Say</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what players and venue owners have to say about FutsalConnectPro.
          </p>
          <Testimonials />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#00E676] via-[#3E8E41] to-[#A7DC6F] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-relaxed tracking-[0.02em] mb-6 text-white">Ready to Play?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white">
            Join thousands of players who book futsal courts through FutsalConnectPro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/venues">
              <Button size="lg" className="bg-white text-green-700 hover:bg-gray-100 px-8">
                Find a Court
              </Button>
            </Link>
            <Link href="/register-venue">
              <Button size="lg" variant="outline" className="text-white border-white bg-green-900 hover:bg-green-800 px-8">
                Register Your Venue
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* App Download */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Download Our Mobile App</h2>
              <p className="text-muted-foreground mb-6">
                Book courts, join events, and manage your bookings on the go with our mobile app.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-black hover:bg-gray-800 gap-2 text-white">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.5,2H8.5L3,7.5v9L8.5,22h9l5.5-5.5v-9L17.5,2z M12,17.5c-3.038,0-5.5-2.462-5.5-5.5s2.462-5.5,5.5-5.5s5.5,2.462,5.5,5.5S15.038,17.5,12,17.5z" />
                  </svg>
                  App Store
                </Button>
                <Button className="bg-black hover:bg-gray-800 gap-2 text-white">
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
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=600&fit=crop&crop=center"
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

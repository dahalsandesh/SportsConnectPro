import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Calendar, Users } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/20">
      <div className="container px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl mb-6">
            Find & Book
            <span className="text-primary block">Sports Venues</span>
            Near You
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover and reserve the perfect sports venue for your next game. From futsal courts to basketball courts,
            we've got you covered.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4 p-2 bg-background rounded-lg shadow-lg border">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Enter location..." className="pl-10 border-0 focus-visible:ring-0 bg-transparent" />
              </div>
              <div className="flex-1 relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="date" className="pl-10 border-0 focus-visible:ring-0 bg-transparent" />
              </div>
              <Button size="lg" className="px-8">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild className="px-8 py-3">
              <Link href="/venues">
                <Search className="h-4 w-4 mr-2" />
                Browse Venues
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="px-8 py-3">
              <Link href="/register-venue">
                <Users className="h-4 w-4 mr-2" />
                List Your Venue
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Venues Listed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">25K+</div>
              <div className="text-sm text-muted-foreground">Bookings Made</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Cities Covered</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

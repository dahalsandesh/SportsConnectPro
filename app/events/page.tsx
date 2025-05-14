import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Trophy, Users, Search, Filter, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Dummy events data
const events = [
  {
    id: "1",
    title: "Summer Futsal Championship",
    type: "Tournament",
    dates: "June 15-20, 2023",
    location: "Green Field Futsal, Kathmandu",
    prizePool: "Rs. 50,000",
    teams: 16,
    registrationDeadline: "June 10, 2023",
    image: "/placeholder.svg?height=300&width=500",
    description:
      "Join the biggest summer futsal tournament in Kathmandu. Open for all teams with exciting prizes to be won.",
  },
  {
    id: "2",
    title: "Corporate Futsal League",
    type: "League",
    dates: "July 5-30, 2023",
    location: "Urban Kicks Arena, Pokhara",
    prizePool: "Rs. 75,000",
    teams: 12,
    registrationDeadline: "June 25, 2023",
    image: "/placeholder.svg?height=300&width=500",
    description:
      "A month-long league for corporate teams. Build team spirit and compete for the prestigious corporate cup.",
  },
  {
    id: "3",
    title: "Women's Futsal Cup",
    type: "Tournament",
    dates: "August 12-14, 2023",
    location: "Victory Futsal Court, Lalitpur",
    prizePool: "Rs. 40,000",
    teams: 8,
    registrationDeadline: "August 5, 2023",
    image: "/placeholder.svg?height=300&width=500",
    description: "Promoting women's futsal with an exciting weekend tournament. Open for all women's teams.",
  },
  {
    id: "4",
    title: "Youth Futsal Challenge",
    type: "Tournament",
    dates: "September 3-4, 2023",
    location: "Premier Futsal Zone, Bhaktapur",
    prizePool: "Rs. 30,000",
    teams: 12,
    registrationDeadline: "August 25, 2023",
    image: "/placeholder.svg?height=300&width=500",
    description: "A tournament for young players under 18. Showcase your talent and compete with the best youth teams.",
  },
  {
    id: "5",
    title: "Charity Futsal Marathon",
    type: "Charity",
    dates: "October 15, 2023",
    location: "Champions Futsal Hub, Kathmandu",
    prizePool: "N/A",
    teams: 24,
    registrationDeadline: "October 10, 2023",
    image: "/placeholder.svg?height=300&width=500",
    description: "Play futsal for a cause. All proceeds go to supporting education for underprivileged children.",
  },
  {
    id: "6",
    title: "Veterans Futsal Cup",
    type: "Tournament",
    dates: "November 18-19, 2023",
    location: "Goal Masters Arena, Pokhara",
    prizePool: "Rs. 35,000",
    teams: 8,
    registrationDeadline: "November 10, 2023",
    image: "/placeholder.svg?height=300&width=500",
    description: "A tournament for players over 35. Relive your glory days and compete in this exciting weekend event.",
  },
]

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="relative mb-16 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10" />
        <Image
          src="/placeholder.svg?height=500&width=1200"
          alt="Events"
          width={1200}
          height={500}
          className="w-full h-[300px] object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center text-white p-4">
          <h1 className="text-4xl font-bold mb-4">Events & Tournaments</h1>
          <p className="text-xl max-w-2xl">
            Discover and participate in exciting futsal events and tournaments happening near you.
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input type="text" placeholder="Search events" className="pl-10" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Select>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="tournament">Tournament</SelectItem>
                <SelectItem value="league">League</SelectItem>
                <SelectItem value="charity">Charity</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="kathmandu">Kathmandu</SelectItem>
                <SelectItem value="lalitpur">Lalitpur</SelectItem>
                <SelectItem value="bhaktapur">Bhaktapur</SelectItem>
                <SelectItem value="pokhara">Pokhara</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-green-600 hover:bg-green-700">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Event */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl overflow-hidden shadow-xl mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 text-white">
            <Badge className="bg-white text-green-700 mb-4">Featured Event</Badge>
            <h2 className="text-3xl font-bold mb-4">National Futsal Championship 2023</h2>
            <p className="mb-6">
              The biggest futsal event of the year with teams from all over the country competing for the national title
              and a prize pool of Rs. 200,000.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>December 10-17, 2023</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>Multiple Venues</span>
              </div>
              <div className="flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                <span>Rs. 200,000 Prize Pool</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>32 Teams</span>
              </div>
              <div className="flex items-center col-span-2">
                <Clock className="h-5 w-5 mr-2" />
                <span>Registration Deadline: November 30, 2023</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="bg-white text-green-700 hover:bg-gray-100">Register Now</Button>
              <Button variant="outline" className="text-white border-white hover:bg-green-800">
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative h-[300px] md:h-auto">
            <Image
              src="/placeholder.svg?height=500&width=600"
              alt="National Futsal Championship"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
              <div className="absolute top-2 left-2">
                <Badge
                  className={`
                  ${
                    event.type === "Tournament"
                      ? "bg-green-600"
                      : event.type === "League"
                        ? "bg-blue-600"
                        : event.type === "Charity"
                          ? "bg-purple-600"
                          : "bg-amber-600"
                  }
                `}
                >
                  {event.type}
                </Badge>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{event.description}</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                  <span>{event.dates}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="truncate">{event.location}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Trophy className="h-4 w-4 mr-1 text-gray-500" />
                  <span>{event.prizePool}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-1 text-gray-500" />
                  <span>{event.teams} Teams</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Deadline: {event.registrationDeadline}
                </div>
                <Link href={`/events/${event.id}`}>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mb-12">
        <nav className="flex items-center gap-1">
          <Button variant="outline" size="icon" disabled>
            &lt;
          </Button>
          <Button variant="outline" size="sm" className="bg-green-600 text-white hover:bg-green-700">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="icon">
            &gt;
          </Button>
        </nav>
      </div>

      {/* Host an Event */}
      <div className="bg-gray-50 rounded-xl p-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Want to Host an Event?</h2>
            <p className="text-gray-600 mb-6">
              If you're interested in organizing a futsal tournament or event, we can help you with venue booking,
              registration, and promotion.
            </p>
            <Button className="bg-green-600 hover:bg-green-700">Contact Us</Button>
          </div>
          <div className="relative h-64">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Host an Event"
              fill
              className="object-cover rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Past Events Gallery */}
      <h2 className="text-2xl font-bold mb-6">Past Events Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div key={item} className="relative h-40 md:h-60 overflow-hidden rounded-lg group">
            <Image
              src={`/placeholder.svg?height=300&width=400&text=Event${item}`}
              alt={`Past Event ${item}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white font-medium">View Gallery</span>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter */}
      <div className="bg-green-600 text-white rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Subscribe to our newsletter to receive updates about upcoming events and tournaments.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input type="email" placeholder="Your email address" className="bg-white text-gray-800" />
          <Button className="bg-white text-green-700 hover:bg-gray-100">Subscribe</Button>
        </div>
      </div>
    </div>
  )
}

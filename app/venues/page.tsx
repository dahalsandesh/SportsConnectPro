import type { Metadata } from "next"
import { Search, Filter, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import VenueList from "@/components/venue-list"

export const metadata: Metadata = {
  title: "Find Venues | FutsalBook",
  description: "Search and browse futsal venues near you",
}

export default function VenuesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Find Futsal Venues</h1>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input type="text" placeholder="Search by venue name" className="pl-10" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Select>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kathmandu">Kathmandu</SelectItem>
                <SelectItem value="lalitpur">Lalitpur</SelectItem>
                <SelectItem value="bhaktapur">Bhaktapur</SelectItem>
                <SelectItem value="pokhara">Pokhara</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Surface Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="artificial-grass">Artificial Grass</SelectItem>
                <SelectItem value="concrete">Concrete</SelectItem>
                <SelectItem value="wood">Wood</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-green-600 hover:bg-green-700">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Map View Toggle */}
      <div className="flex justify-end mb-6">
        <Button variant="outline" className="gap-2">
          <MapPin className="h-4 w-4" />
          Map View
        </Button>
      </div>

      {/* Venue Listing */}
      <VenueList />

      {/* Pagination */}
      <div className="flex justify-center mt-8">
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
    </div>
  )
}

import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import VenueRegistrationForm from "@/components/venue-registration-form"

export const metadata: Metadata = {
  title: "Register Your Venue | FutsalBook",
  description: "Register your futsal venue on our platform and increase your bookings",
}

export default function RegisterVenuePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-green-600">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span>Register Your Venue</span>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-4">Register Your Futsal Venue</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join our platform and increase your bookings. Easy management, more visibility, and secure payments.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <VenueRegistrationForm />
        </div>
      </div>
    </div>
  )
}

import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import VenueRegistrationForm from "@/components/venue-registration-form";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Register Your Venue | FutsalConnectPro",
  description:
    "Register your futsal venue on our platform and increase your bookings",
};

export default function RegisterVenuePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Background Image */}
      <div className="relative bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&h=600&fit=crop&crop=center"
            alt="Professional futsal venue"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <div className="relative container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-green-100 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-white">Register Your Venue</span>
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Register Your Venue
            </h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto mb-8">
              Join our platform and increase your bookings. Easy management,
              more visibility, and secure payments.
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-3xl mb-3">📈</div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Increase Bookings
                </h3>
                <p className="text-green-100 text-sm">
                  Reach more customers and boost your revenue
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Easy Management
                </h3>
                <p className="text-green-100 text-sm">
                  Streamlined booking and venue management
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-3xl mb-3">💳</div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Secure Payments
                </h3>
                <p className="text-green-100 text-sm">
                  Safe and reliable payment processing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Registration Form */}
          <div className="bg-card border border-border rounded-lg shadow-lg p-6 mb-8">
            <VenueRegistrationForm />
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                Why Choose Us?
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>No setup fees or hidden charges</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>24/7 customer support</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Real-time booking management</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Detailed analytics and reports</span>
                </li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                Getting Started
              </h3>
              <div className="space-y-3 text-muted-foreground">
                <div className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                    1
                  </span>
                  <span>Fill out the registration form</span>
                </div>
                <div className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                    2
                  </span>
                  <span>Upload required documents</span>
                </div>
                <div className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                    3
                  </span>
                  <span>Wait for approval (2-3 business days)</span>
                </div>
                <div className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                    4
                  </span>
                  <span>Start receiving bookings!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

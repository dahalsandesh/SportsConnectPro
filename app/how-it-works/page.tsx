import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, HelpCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">How FutsalConnectPro Works</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We've made booking futsal courts simple and hassle-free. Follow these easy steps to get started.
        </p>
      </div>

      {/* Main Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
        <div className="order-2 md:order-1">
          <div className="bg-green-50 p-8 rounded-xl h-full">
            <div className="flex items-center mb-4">
              <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                1
              </div>
              <h2 className="text-2xl font-bold">Find a Venue</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Search for futsal venues near you or by name. Filter by surface type, capacity, and price to find the
              perfect court for your game.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <span>Browse venues by location</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <span>Filter by surface type (artificial grass, concrete, wood)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <span>Compare prices and facilities</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <span>Read reviews from other players</span>
              </li>
            </ul>
            <Link href="/venues">
              <Button className="bg-green-600 hover:bg-green-700">Find Venues Now</Button>
            </Link>
          </div>
        </div>
        <div className="order-1 md:order-2 flex items-center justify-center">
          <div className="relative w-full h-80 md:h-96">
            <Image
              src="/placeholder.svg?height=500&width=600"
              alt="Find a Venue"
              fill
              className="object-cover rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
        <div className="flex items-center justify-center">
          <div className="relative w-full h-80 md:h-96">
            <Image
              src="/placeholder.svg?height=500&width=600"
              alt="Book a Slot"
              fill
              className="object-cover rounded-xl shadow-lg"
            />
          </div>
        </div>
        <div>
          <div className="bg-blue-50 p-8 rounded-xl h-full">
            <div className="flex items-center mb-4">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                2
              </div>
              <h2 className="text-2xl font-bold">Book a Slot</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Select your preferred date and time slot. Check real-time availability to ensure the court is free when
              you want to play.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <span>View real-time availability calendar</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <span>Choose your preferred date and time</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <span>Select booking duration</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <span>Add special requests or notes</span>
              </li>
            </ul>
            <Button className="bg-blue-600 hover:bg-blue-700">Learn More</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
        <div className="order-2 md:order-1">
          <div className="bg-purple-50 p-8 rounded-xl h-full">
            <div className="flex items-center mb-4">
              <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                3
              </div>
              <h2 className="text-2xl font-bold">Make Payment</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Secure payment through Khalti or other payment methods. Get instant confirmation of your booking.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                <span>Multiple payment options</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                <span>Secure transaction processing</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                <span>Instant booking confirmation</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                <span>Email receipt and booking details</span>
              </li>
            </ul>
            <Button className="bg-purple-600 hover:bg-purple-700">View Payment Options</Button>
          </div>
        </div>
        <div className="order-1 md:order-2 flex items-center justify-center">
          <div className="relative w-full h-80 md:h-96">
            <Image
              src="/placeholder.svg?height=500&width=600"
              alt="Make Payment"
              fill
              className="object-cover rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
        <div className="flex items-center justify-center">
          <div className="relative w-full h-80 md:h-96">
            <Image
              src="/placeholder.svg?height=500&width=600"
              alt="Play & Enjoy"
              fill
              className="object-cover rounded-xl shadow-lg"
            />
          </div>
        </div>
        <div>
          <div className="bg-amber-50 p-8 rounded-xl h-full">
            <div className="flex items-center mb-4">
              <div className="bg-amber-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                4
              </div>
              <h2 className="text-2xl font-bold">Play & Enjoy</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Show up at the venue, play your game, and have fun with friends and teammates. Don't forget to leave a
              review!
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                <span>Show your booking confirmation at the venue</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                <span>Enjoy your game with no hassle</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                <span>Rate your experience and leave a review</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                <span>Book again for your next game</span>
              </li>
            </ul>
            <Button className="bg-amber-600 hover:bg-amber-700">Book Your First Game</Button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 rounded-xl p-8 mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="max-w-3xl mx-auto">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I cancel a booking?</AccordionTrigger>
            <AccordionContent>
              You can cancel a booking through your account dashboard. Go to "My Bookings", find the booking you want to
              cancel, and click the "Cancel" button. Please note that cancellation policies vary by venue, and some may
              charge a cancellation fee depending on how close to the booking time you cancel.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Can I modify my booking time?</AccordionTrigger>
            <AccordionContent>
              Yes, you can modify your booking time if the new time slot is available. Go to "My Bookings" in your
              account dashboard, find the booking you want to modify, and click "Change Time". If the new time slot is
              available, you can confirm the change. Some venues may charge a small fee for modifications.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>What payment methods are accepted?</AccordionTrigger>
            <AccordionContent>
              We accept various payment methods including Khalti, credit/debit cards, and bank transfers. The available
              payment options will be displayed during the checkout process. All payments are processed securely through
              our payment partners.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Do I need to create an account to book a court?</AccordionTrigger>
            <AccordionContent>
              Yes, you need to create an account to book a court. This helps us manage your bookings, send
              confirmations, and provide a better experience. Creating an account is free and only takes a minute. You
              can sign up using your email or social media accounts.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>What if the venue is closed when I arrive?</AccordionTrigger>
            <AccordionContent>
              If you arrive at the venue and find it closed during your booked time, please contact our customer support
              immediately. We'll help resolve the issue and process a refund if necessary. We recommend taking a photo
              of the closed venue as evidence to support your claim.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="text-center mt-8">
          <Link href="/faq">
            <Button variant="outline" className="gap-2">
              View All FAQs <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* For Venue Owners */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 text-white mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">For Venue Owners</h2>
            <p className="text-lg mb-6">
              Own a futsal venue? Join FutsalConnectPro to increase your bookings, manage your venue efficiently, and
              grow your business.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 mt-0.5" />
                <span>Increase visibility and reach more players</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 mt-0.5" />
                <span>Manage bookings and availability easily</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 mt-0.5" />
                <span>Secure online payments</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 mt-0.5" />
                <span>Analytics and reporting tools</span>
              </li>
            </ul>
            <Link href="/register-venue">
              <Button className="bg-white text-green-700 hover:bg-gray-100">Register Your Venue</Button>
            </Link>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full h-64 md:h-80">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Venue Owner"
                fill
                className="object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Need Help */}
      <div className="text-center mb-20">
        <HelpCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
        <h2 className="text-3xl font-bold mb-4">Need More Help?</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Our support team is always ready to assist you with any questions or issues.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 px-8">
              Contact Support
            </Button>
          </Link>
          <Link href="/faq">
            <Button size="lg" variant="outline" className="px-8">
              Browse FAQs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

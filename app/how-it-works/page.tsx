import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, HelpCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl font-bold mb-4 text-foreground">How FutsalConnectPro Works</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We've made booking futsal courts simple and hassle-free. Follow these easy steps to get started.
          </p>
        </div>

        {/* Main Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
          {/* Step 1 - Find a Venue */}
          <div className="order-2 md:order-1 animate-slide-in-left">
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-8 rounded-xl h-full border border-green-200 dark:border-green-800/30">
              <div className="flex items-center mb-4">
                <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 shadow-lg">
                  1
                </div>
                <h2 className="text-2xl font-bold text-foreground">Find a Venue</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Search for futsal venues near you or by name. Filter by surface type, capacity, and price to find the
                perfect court for your game.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Browse venues by location</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Filter by surface type (artificial grass, concrete, wood)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Compare prices and facilities</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Read reviews from other players</span>
                </li>
              </ul>
              <Link href="/venues">
                <Button className="bg-green-600 hover:bg-green-700 text-white shadow-lg">Find Venues Now</Button>
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2 flex items-center justify-center animate-slide-in-right">
            <div className="relative w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=500&fit=crop&crop=center"
                alt="Modern futsal venue with artificial grass court"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>

        {/* Step 2 - Book a Slot */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
          <div className="flex items-center justify-center animate-slide-in-left">
            <div className="relative w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=500&fit=crop&crop=center"
                alt="Calendar booking interface on mobile device"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
          <div className="animate-slide-in-right">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-8 rounded-xl h-full border border-blue-200 dark:border-blue-800/30">
              <div className="flex items-center mb-4">
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 shadow-lg">
                  2
                </div>
                <h2 className="text-2xl font-bold text-foreground">Book a Slot</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Select your preferred date and time slot. Check real-time availability to ensure the court is free when
                you want to play.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">View real-time availability calendar</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Choose your preferred date and time</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Select booking duration</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Add special requests or notes</span>
                </li>
              </ul>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">Learn More</Button>
            </div>
          </div>
        </div>

        {/* Step 3 - Make Payment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
          <div className="order-2 md:order-1 animate-slide-in-left">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-8 rounded-xl h-full border border-purple-200 dark:border-purple-800/30">
              <div className="flex items-center mb-4">
                <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 shadow-lg">
                  3
                </div>
                <h2 className="text-2xl font-bold text-foreground">Make Payment</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Secure payment through Khalti or other payment methods. Get instant confirmation of your booking.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Multiple payment options</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Secure transaction processing</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Instant booking confirmation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Email receipt and booking details</span>
                </li>
              </ul>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg">View Payment Options</Button>
            </div>
          </div>
          <div className="order-1 md:order-2 flex items-center justify-center animate-slide-in-right">
            <div className="relative w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=500&fit=crop&crop=center"
                alt="Secure mobile payment interface"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>

        {/* Step 4 - Play & Enjoy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
          <div className="flex items-center justify-center animate-slide-in-left">
            <div className="relative w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=500&fit=crop&crop=center"
                alt="Happy futsal players celebrating on court"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
          <div className="animate-slide-in-right">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 p-8 rounded-xl h-full border border-amber-200 dark:border-amber-800/30">
              <div className="flex items-center mb-4">
                <div className="bg-amber-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 shadow-lg">
                  4
                </div>
                <h2 className="text-2xl font-bold text-foreground">Play & Enjoy</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Show up at the venue, play your game, and have fun with friends and teammates. Don't forget to leave a
                review!
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Show your booking confirmation at the venue</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Enjoy your game with no hassle</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Rate your experience and leave a review</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Book again for your next game</span>
                </li>
              </ul>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg">Book Your First Game</Button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl p-8 mb-20 border border-gray-200 dark:border-gray-700/50 animate-fade-in-up">
          <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="max-w-3xl mx-auto">
            <AccordionItem value="item-1" className="border-gray-200 dark:border-gray-700">
              <AccordionTrigger className="text-foreground hover:text-primary">
                How do I cancel a booking?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                You can cancel a booking through your account dashboard. Go to "My Bookings", find the booking you want
                to cancel, and click the "Cancel" button. Please note that cancellation policies vary by venue, and some
                may charge a cancellation fee depending on how close to the booking time you cancel.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-gray-200 dark:border-gray-700">
              <AccordionTrigger className="text-foreground hover:text-primary">
                Can I modify my booking time?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes, you can modify your booking time if the new time slot is available. Go to "My Bookings" in your
                account dashboard, find the booking you want to modify, and click "Change Time". If the new time slot is
                available, you can confirm the change. Some venues may charge a small fee for modifications.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-gray-200 dark:border-gray-700">
              <AccordionTrigger className="text-foreground hover:text-primary">
                What payment methods are accepted?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We accept various payment methods including Khalti, credit/debit cards, and bank transfers. The
                available payment options will be displayed during the checkout process. All payments are processed
                securely through our payment partners.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border-gray-200 dark:border-gray-700">
              <AccordionTrigger className="text-foreground hover:text-primary">
                Do I need to create an account to book a court?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes, you need to create an account to book a court. This helps us manage your bookings, send
                confirmations, and provide a better experience. Creating an account is free and only takes a minute. You
                can sign up using your email or social media accounts.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5" className="border-gray-200 dark:border-gray-700">
              <AccordionTrigger className="text-foreground hover:text-primary">
                What if the venue is closed when I arrive?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                If you arrive at the venue and find it closed during your booked time, please contact our customer
                support immediately. We'll help resolve the issue and process a refund if necessary. We recommend taking
                a photo of the closed venue as evidence to support your claim.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="text-center mt-8">
            <Link href="/faq">
              <Button
                variant="outline"
                className="gap-2 border-gray-300 dark:border-gray-600 text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                View All FAQs <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* For Venue Owners */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 text-white mb-20 shadow-2xl animate-scale-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-white">For Venue Owners</h2>
              <p className="text-lg mb-6 text-green-50">
                Own a futsal venue? Join FutsalConnectPro to increase your bookings, manage your venue efficiently, and
                grow your business.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-green-200 flex-shrink-0" />
                  <span className="text-green-50">Increase visibility and reach more players</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-green-200 flex-shrink-0" />
                  <span className="text-green-50">Manage bookings and availability easily</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-green-200 flex-shrink-0" />
                  <span className="text-green-50">Secure online payments</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-green-200 flex-shrink-0" />
                  <span className="text-green-50">Analytics and reporting tools</span>
                </li>
              </ul>
              <Link href="/register-venue">
                <Button className="bg-white text-green-700 hover:bg-gray-100 shadow-lg font-semibold">
                  Register Your Venue
                </Button>
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=500&fit=crop&crop=center"
                  alt="Professional venue owner managing futsal facility"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* Need Help */}
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-4 inline-flex mb-4">
            <HelpCircle className="h-16 w-16 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-foreground">Need More Help?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Our support team is always ready to assist you with any questions or issues.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 px-8 text-white shadow-lg">
                Contact Support
              </Button>
            </Link>
            <Link href="/faq">
              <Button
                size="lg"
                variant="outline"
                className="px-8 border-gray-300 dark:border-gray-600 text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Browse FAQs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find answers to common questions about FutsalConnectPro, bookings, payments, and more.
        </p>
      </div>

      {/* FAQ Categories */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <Button variant="outline" className="rounded-full px-6">
          All
        </Button>
        <Button variant="outline" className="rounded-full px-6 bg-green-50 border-green-200 text-green-700">
          Bookings
        </Button>
        <Button variant="outline" className="rounded-full px-6">
          Payments
        </Button>
        <Button variant="outline" className="rounded-full px-6">
          Venues
        </Button>
        <Button variant="outline" className="rounded-full px-6">
          Events
        </Button>
        <Button variant="outline" className="rounded-full px-6">
          Account
        </Button>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto mb-16">
        <h2 className="text-2xl font-bold mb-6">Bookings</h2>
        <Accordion type="single" collapsible className="mb-8">
          <AccordionItem value="booking-1">
            <AccordionTrigger>How do I book a futsal court?</AccordionTrigger>
            <AccordionContent>
              Booking a futsal court is easy! First, search for venues in your area using our search function. Once you
              find a venue you like, click on it to view details and available courts. Select your preferred date and
              time slot, choose the duration, and proceed to payment. After completing the payment, you'll receive a
              booking confirmation via email and in your account dashboard.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="booking-2">
            <AccordionTrigger>Can I modify my booking time?</AccordionTrigger>
            <AccordionContent>
              Yes, you can modify your booking time if the new time slot is available. Go to "My Bookings" in your
              account dashboard, find the booking you want to modify, and click "Change Time". If the new time slot is
              available, you can confirm the change. Some venues may charge a small fee for modifications made less than
              24 hours before the original booking time.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="booking-3">
            <AccordionTrigger>How do I cancel a booking?</AccordionTrigger>
            <AccordionContent>
              You can cancel a booking through your account dashboard. Go to "My Bookings", find the booking you want to
              cancel, and click the "Cancel" button. Please note that cancellation policies vary by venue, and some may
              charge a cancellation fee depending on how close to the booking time you cancel. Most venues offer full
              refunds for cancellations made 24 hours or more in advance.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="booking-4">
            <AccordionTrigger>Can I book multiple time slots?</AccordionTrigger>
            <AccordionContent>
              Yes, you can book multiple consecutive time slots if they're available. During the booking process, you
              can select the duration of your booking (e.g., 1 hour, 2 hours, etc.). If you need to book non-consecutive
              slots or regular weekly bookings, please contact the venue directly or reach out to our customer support
              for assistance with setting up recurring bookings.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="booking-5">
            <AccordionTrigger>What if the venue is closed when I arrive?</AccordionTrigger>
            <AccordionContent>
              If you arrive at the venue and find it closed during your booked time, please contact our customer support
              immediately. We'll help resolve the issue and process a refund if necessary. We recommend taking a photo
              of the closed venue as evidence to support your claim. You can reach our support team through the app,
              website, or by calling our customer service number.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <h2 className="text-2xl font-bold mb-6">Payments</h2>
        <Accordion type="single" collapsible className="mb-8">
          <AccordionItem value="payment-1">
            <AccordionTrigger>What payment methods are accepted?</AccordionTrigger>
            <AccordionContent>
              We accept various payment methods including Khalti, credit/debit cards, and bank transfers. The available
              payment options will be displayed during the checkout process. All payments are processed securely through
              our payment partners. For some venues, we also offer a "Pay at Venue" option, allowing you to reserve the
              court online and pay in cash when you arrive.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="payment-2">
            <AccordionTrigger>Is my payment information secure?</AccordionTrigger>
            <AccordionContent>
              Yes, we take payment security very seriously. All payment transactions are encrypted and processed through
              secure payment gateways. We do not store your credit card information on our servers. Our platform
              complies with industry-standard security protocols to ensure your financial information remains safe and
              protected at all times.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="payment-3">
            <AccordionTrigger>How do refunds work?</AccordionTrigger>
            <AccordionContent>
              Refund policies vary by venue and depend on when you cancel your booking. Generally, cancellations made 24
              hours or more in advance qualify for a full refund. Cancellations made less than 24 hours before the
              booking time may be subject to partial refunds or cancellation fees. If you're eligible for a refund, it
              will be processed back to your original payment method within 5-7 business days.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="payment-4">
            <AccordionTrigger>Do you offer any discounts?</AccordionTrigger>
            <AccordionContent>
              Yes, we offer various discounts and promotions throughout the year. These include off-peak hour discounts,
              first-time booking discounts, and seasonal promotions. Some venues also offer special rates for regular
              customers or group bookings. You can find current promotions on our homepage or in the "Offers" section of
              our app and website. We also send exclusive deals to our newsletter subscribers.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <h2 className="text-2xl font-bold mb-6">Venues</h2>
        <Accordion type="single" collapsible className="mb-8">
          <AccordionItem value="venue-1">
            <AccordionTrigger>How do I register my venue on FutsalConnectPro?</AccordionTrigger>
            <AccordionContent>
              To register your venue, click on the "Register Your Venue" link in the navigation menu. Fill out the
              application form with details about your venue, including location, facilities, court information, and
              business documents. Our team will review your application and get back to you within 2-3 business days.
              Once approved, you'll receive access to the venue management dashboard where you can manage bookings,
              availability, and payments.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="venue-2">
            <AccordionTrigger>What facilities do the venues typically offer?</AccordionTrigger>
            <AccordionContent>
              Facilities vary by venue, but most futsal venues on our platform offer changing rooms, showers, parking,
              and drinking water. Some venues also have additional amenities like cafeterias, equipment rental,
              spectator seating, and air conditioning. You can view the specific facilities offered by each venue on
              their detail page before making a booking.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="venue-3">
            <AccordionTrigger>Are there different types of court surfaces?</AccordionTrigger>
            <AccordionContent>
              Yes, futsal courts come with different surface types, primarily artificial grass (turf), concrete, and
              wood. Each surface offers a different playing experience. Artificial grass provides better cushioning and
              is gentler on the body, concrete offers faster gameplay, and wood surfaces are typically found in indoor
              venues and provide consistent ball roll. You can filter venues by surface type when searching for courts.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <h2 className="text-2xl font-bold mb-6">Account</h2>
        <Accordion type="single" collapsible className="mb-8">
          <AccordionItem value="account-1">
            <AccordionTrigger>Do I need to create an account to book a court?</AccordionTrigger>
            <AccordionContent>
              Yes, you need to create an account to book a court. This helps us manage your bookings, send
              confirmations, and provide a better experience. Creating an account is free and only takes a minute. You
              can sign up using your email or social media accounts. Once registered, you'll be able to view your
              booking history, save favorite venues, and receive personalized recommendations.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="account-2">
            <AccordionTrigger>How do I reset my password?</AccordionTrigger>
            <AccordionContent>
              If you've forgotten your password, click on the "Login" button, then select "Forgot Password". Enter the
              email address associated with your account, and we'll send you a password reset link. Click on the link in
              the email and follow the instructions to create a new password. For security reasons, the reset link is
              valid for 24 hours only.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="account-3">
            <AccordionTrigger>Can I delete my account?</AccordionTrigger>
            <AccordionContent>
              Yes, you can delete your account at any time. Go to your account settings, scroll to the bottom, and click
              on "Delete Account". Please note that deleting your account will permanently remove all your data,
              including booking history and saved venues. If you have any active bookings, we recommend waiting until
              after those bookings before deleting your account.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Still Have Questions */}
      <div className="bg-gray-50 rounded-xl p-8 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
        <p className="text-gray-600 mb-6">
          If you couldn't find the answer to your question, feel free to contact our support team.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-green-600 hover:bg-green-700" asChild>
            <Link href="/contact">Contact Support</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="mailto:support@futsalconnectpro.com">Email Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

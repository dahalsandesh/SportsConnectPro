import { Search, Calendar, CreditCard, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: <Search className="h-10 w-10 text-green-600" />,
    title: "Find a Venue",
    description: "Search for futsal venues near you or by name. Filter by surface type, capacity, and price.",
  },
  {
    icon: <Calendar className="h-10 w-10 text-green-600" />,
    title: "Book a Slot",
    description: "Select your preferred date and time slot. Check real-time availability.",
  },
  {
    icon: <CreditCard className="h-10 w-10 text-green-600" />,
    title: "Make Payment",
    description: "Secure payment through Khalti or other payment methods. Get instant confirmation.",
  },
  {
    icon: <CheckCircle className="h-10 w-10 text-green-600" />,
    title: "Play & Enjoy",
    description: "Show up at the venue, play your game, and have fun with friends and teammates.",
  },
]

export default function HowItWorks() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center text-center">
          <div className="mb-4 p-4 bg-green-50 rounded-full">{step.icon}</div>
          <h3 className="text-xl font-bold mb-2">{step.title}</h3>
          <p className="text-gray-600">{step.description}</p>
        </div>
      ))}
    </div>
  )
}

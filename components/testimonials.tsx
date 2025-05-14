"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Dummy testimonial data
const testimonials = [
  {
    id: 1,
    name: "Rajesh Sharma",
    role: "Regular Player",
    image: "/placeholder.svg?height=100&width=100",
    quote:
      "This platform has made booking futsal courts so much easier. I used to call multiple venues to check availability, but now I can see everything in one place!",
    rating: 5,
  },
  {
    id: 2,
    name: "Anita Gurung",
    role: "Team Captain",
    image: "/placeholder.svg?height=100&width=100",
    quote:
      "As someone who organizes weekly games for my team, this website has been a game-changer. The booking process is smooth, and I love getting instant confirmations.",
    rating: 5,
  },
  {
    id: 3,
    name: "Sunil Thapa",
    role: "Venue Owner",
    image: "/placeholder.svg?height=100&width=100",
    quote:
      "Since listing our venue on this platform, our bookings have increased by 40%. The management system is intuitive and has saved us a lot of administrative work.",
    rating: 4,
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1))
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1))
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="flex-shrink-0 w-full">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-20 h-20 mb-4 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <blockquote className="text-lg italic mb-6">"{testimonial.quote}"</blockquote>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full z-10 shadow-md md:flex hidden"
        onClick={prevTestimonial}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white rounded-full z-10 shadow-md md:flex hidden"
        onClick={nextTestimonial}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${index === currentIndex ? "bg-green-600" : "bg-gray-300"}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

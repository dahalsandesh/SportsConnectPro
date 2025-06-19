"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const carouselItems = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1920&h=800&fit=crop&crop=center",
    title: "Book Your Perfect Futsal Court",
    subtitle:
      "Find and reserve the best futsal courts in your area with instant confirmation",
    cta: "Book Now",
    link: "/venues",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&h=800&fit=crop&crop=center",
    title: "Join Tournaments & Events",
    subtitle:
      "Participate in local tournaments and futsal events with players from your community",
    cta: "View Events",
    link: "/events",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=1920&h=800&fit=crop&crop=center",
    title: "Own a Futsal Venue?",
    subtitle:
      "List your venue on our platform and increase your bookings by 300%",
    cta: "Register Venue",
    link: "/register-venue",
  },
];

export default function HeaderCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === carouselItems.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? carouselItems.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Carousel items */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {carouselItems.map((item) => (
          <div key={item.id} className="relative w-full h-full flex-shrink-0">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.title}
              fill
              className="object-cover"
              priority={item.id === 1}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-10" />
            <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center text-white p-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 max-w-4xl text-white drop-shadow-lg">
                {item.title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl text-white/90 drop-shadow-md">
                {item.subtitle}
              </p>
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                asChild>
                <a href={item.link}>{item.cta}</a>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 rounded-full h-12 w-12"
        onClick={prevSlide}>
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 rounded-full h-12 w-12"
        onClick={nextSlide}>
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-8 rounded-full transition-all ${
              index === currentSlide ? "bg-green-500 w-12" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";

interface Event {
  eventId: string;
  title: string;
  image: string;
  maxSeat: number;
  date: string;
  time: string;
  // Optional fields that might be present
  type?: string;
  location?: string;
  description?: string;
  sportCategory?: string;
  status?: string;
}

interface EventCardProps {
  event: Event;
  className?: string;
}

export default function EventCard({ event, className }: EventCardProps) {
  // Format date from YYYY-MM-DD to Month Day, Year
  const formattedDate = event.date 
    ? new Date(event.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Date TBD';

  // Format time from HH:MM:SS to hh:mm AM/PM
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formattedTime = event.time ? formatTime(event.time) : '';

  return (
    <Link 
      href={`/events/${event.eventId}`}
      className={`block group overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300 ${className}`}
    >
      <div className="relative h-48 w-full">
        <Image
          src={event.image || "/event-placeholder.jpg"}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {event.type && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-0">
              {event.type}
            </Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{event.title}</h3>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{formattedDate} {formattedTime && `• ${formattedTime}`}</span>
          </div>
          
          {event.location && (
            <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
              <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>{event.location}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Users className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{event.maxSeat} seats available</span>
          </div>

          {event.sportCategory && (
            <div className="pt-1">
              <Badge variant="outline" className="text-xs">
                {event.sportCategory}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

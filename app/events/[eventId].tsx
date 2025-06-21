"use client";
import { useParams } from "next/navigation";
import { useGetEventByIdQuery } from "@/redux/api/publicApi";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Trophy, Users } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function EventDetailPage() {
  const { eventId } = useParams();
  const { data: event, isLoading, isError } = useGetEventByIdQuery(eventId);
  const [showRegister, setShowRegister] = useState(false);

  if (isLoading) return <div className="py-12 text-center">Loading event...</div>;
  if (isError || !event) return <div className="py-12 text-center text-red-500">Event not found.</div>;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="rounded-lg overflow-hidden border mb-6">
        <Image src={event.image || "/placeholder.svg"} alt="Event" width={600} height={320} className="object-cover w-full h-64" />
      </div>
      <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
      <div className="flex flex-wrap gap-4 text-muted-foreground mb-4">
        <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" />{event.date}</span>
        <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" />{event.location || "-"}</span>
        <span className="flex items-center"><Trophy className="h-4 w-4 mr-1" />Max Seat: {event.maxSeat}</span>
        <span className="flex items-center"><Users className="h-4 w-4 mr-1" />{event.time}</span>
      </div>
      <p className="mb-6 text-lg text-foreground">{event.description}</p>
      {showRegister ? (
        <form className="space-y-4 bg-card border rounded-lg p-6">
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input type="text" className="border rounded px-3 py-2 w-full" required />
          </div>
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input type="email" className="border rounded px-3 py-2 w-full" required />
          </div>
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">Register</Button>
        </form>
      ) : (
        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => setShowRegister(true)}>
          Register
        </Button>
      )}
    </div>
  );
}

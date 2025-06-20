"use client";

import React, { useState } from "react";
import { useGetAllEventsQuery } from "@/redux/api/admin/eventsApi";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface EventsListProps {
  onView: (eventId: string) => void;
}

const EventsList: React.FC<EventsListProps> = ({ onView }) => {
  const { data: events, isLoading, error } = useGetAllEventsQuery();

  if (isLoading) return <div>Loading events...</div>;
  if (error) return <div>Error loading events</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Events</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Max Seats</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events && events.length > 0 ? (
              events.map((event) => (
                <tr key={event.eventId}>
                  <td className="px-4 py-2">
                    <img src={event.image} alt={event.title} className="w-24 h-16 object-cover rounded" />
                  </td>
                  <td className="px-4 py-2">{event.title}</td>
                  <td className="px-4 py-2">{event.date}</td>
                  <td className="px-4 py-2">{event.time}</td>
                  <td className="px-4 py-2">{event.maxSeat}</td>
                  <td className="px-4 py-2">
                    <Button size="icon" variant="outline" onClick={() => onView(event.eventId)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">No events found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventsList;

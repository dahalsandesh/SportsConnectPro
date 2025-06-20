"use client";

import React from "react";
import { useGetEventByIdQuery } from "@/redux/api/admin/eventsApi";

interface EventDetailsProps {
  eventId: string;
}

const EventDetails: React.FC<EventDetailsProps> = ({ eventId }) => {
  const { data, isLoading, error } = useGetEventByIdQuery(eventId);
  if (isLoading) return <div>Loading...</div>;
  if (error || !data) return <div>Failed to load event details.</div>;
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">{data.title}</h2>
      <img src={data.image} alt={data.title} className="w-full max-w-md mb-4 rounded" />
      <div className="mb-2"><b>Date:</b> {data.date} <b>Time:</b> {data.time}</div>
      <div className="mb-2"><b>Max Seats:</b> {data.maxSeat}</div>
    </div>
  );
};

export default EventDetails;

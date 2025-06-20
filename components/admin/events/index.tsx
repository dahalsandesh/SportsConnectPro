"use client";

import React, { useState } from "react";
import EventsList from "./events-list";
import dynamic from "next/dynamic";
import Link from "next/link";

const EventDetails = dynamic(() => import("./event-details"), { ssr: false });

const AdminEventsPage: React.FC = () => {
  const [detailsEventId, setDetailsEventId] = useState<string | null>(null);

  return (
    <div className="container mx-auto py-8">
      <nav className="text-sm mb-6" aria-label="Breadcrumb">
        <ol className="list-reset flex text-gray-500">
          <li>
            <Link href="/admin" className="hover:underline text-gray-700">Admin</Link>
            <span className="mx-2">/</span>
          </li>
          <li className="text-black font-medium">Events</li>
        </ol>
      </nav>
      <div className="mb-8" />
      <EventsList onView={setDetailsEventId} />
      {detailsEventId && (
        <React.Suspense fallback={<div>Loading details...</div>}>
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow-lg p-6 relative max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <button className="absolute top-2 right-2" onClick={() => setDetailsEventId(null)}>
                ✕
              </button>
              <EventDetails eventId={detailsEventId} />
            </div>
          </div>
        </React.Suspense>
      )}
    </div>
  );
};

export default AdminEventsPage;

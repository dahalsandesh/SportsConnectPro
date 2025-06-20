"use client";

import { useGetCourtsQuery } from "@/redux/api/publicApi";
import CourtCard from "@/components/court-card";

export default function CourtsPageClient() {
  const { data, isLoading, error } = useGetCourtsQuery();
  const fallbackImage = "/court-fallback.jpg";

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">All Courts</h1>
      {isLoading && <p>Loading courts...</p>}
      {error && <p className="text-red-500">Failed to load courts.</p>}
      {data && data.length === 0 && <p>No courts found.</p>}
      {data && data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.slice(0, 50).map((court: any) => (
            <CourtCard key={court.courtID || court.id} court={court} fallbackImage={fallbackImage} />
          ))}
        </div>
      )}
    </div>
  );
}

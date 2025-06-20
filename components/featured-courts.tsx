"use client";
import CourtCard, { Court } from "./court-card";
import { useGetCourtsQuery } from "@/redux/api/publicApi";

const fallbackImages = [
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=300&fit=crop&crop=center"
];

export default function FeaturedCourts() {
  const { data: courts = [], isLoading, isError } = useGetCourtsQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-muted rounded-lg h-96 w-full"></div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-destructive">
        Failed to load courts. Please try again later.
      </div>
    );
  }

  if (!courts || courts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No courts available at the moment.
      </div>
    );
  }

  const featuredCourts = courts.slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredCourts.map((court: Court, idx: number) => (
        <CourtCard key={court.courtID} court={court} fallbackImage={fallbackImages[idx % fallbackImages.length]} />
      ))}
    </div>
  );
}

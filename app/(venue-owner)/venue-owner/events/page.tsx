"use client";

import { Suspense, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SportsEventManagement from "../components/SportsEventManagement";
import { useGetCourtsQuery } from "@/redux/api/venue-owner/courtApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EventsPage() {
  const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);
  const { data: courts, isLoading: isLoadingCourts } = useGetCourtsQuery();

  if (isLoadingCourts) {
    return <CourtsSkeleton />;
  }

  if (!courts?.length) {
    return (
      <div className="p-4">
        <p>No courts available. Please add a court first.</p>
      </div>
    );
  }

  if (!selectedCourtId) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Select a Court</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courts.map((court) => (
            <Card
              key={court.courtId}
              className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{court.courtName}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setSelectedCourtId(court.courtId)}
                  className="w-full">
                  View Events
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<EventsSkeleton />}>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Events</h1>
          <Button variant="outline" onClick={() => setSelectedCourtId(null)}>
            Back to Courts
          </Button>
        </div>
        <SportsEventManagement courtId={selectedCourtId} />
      </div>
    </Suspense>
  );
}

function CourtsSkeleton() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Select a Court</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function EventsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-20" />
            </CardContent>
            <CardContent className="flex gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

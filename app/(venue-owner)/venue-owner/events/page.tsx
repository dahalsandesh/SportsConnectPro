"use client";

import { Suspense, useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SportsEventManagement from "../components/SportsEventManagement";
import { useGetCourtsQuery } from "@/redux/api/venue-owner/courtApi";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CourtType {
  courtId: string;
  courtName: string;
  categoryName?: string;
  isActive?: boolean;
}

function CourtDropdown({ courts, selectedCourt, onSelect }: {
  courts: CourtType[];
  selectedCourt: CourtType | null;
  onSelect: (court: CourtType) => void;
}) {
  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor="court-select" className="text-sm font-medium text-gray-700">
        Select Court
      </label>
      <Select
        value={selectedCourt?.courtId || ''}
        onValueChange={(value) => {
          const court = courts.find(c => c.courtId === value);
          if (court) onSelect(court);
        }}
      >
        <SelectTrigger className="w-full md:w-[300px]">
          <SelectValue placeholder="Select a court" />
        </SelectTrigger>
        <SelectContent>
          {courts.map((court) => (
            <SelectItem key={court.courtId} value={court.courtId}>
              <div className="flex items-center justify-between w-full">
                <span>{court.courtName}</span>
                <div className="flex space-x-2 ml-2">
                  {court.categoryName && (
                    <Badge variant="outline" className="text-xs">
                      {court.categoryName}
                    </Badge>
                  )}
                  {!court.isActive && (
                    <Badge variant="secondary" className="text-xs">
                      Inactive
                    </Badge>
                  )}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default function EventsPage() {
  const [selectedCourt, setSelectedCourt] = useState<CourtType | null>(null);
  const { data: courts = [], isLoading: isLoadingCourts } = useGetCourtsQuery();

  // Auto-select the first court if none is selected
  useEffect(() => {
    if (courts.length > 0 && !selectedCourt) {
      setSelectedCourt(courts[0]);
    }
  }, [courts, selectedCourt]);

  if (isLoadingCourts) {
    return <CourtsSkeleton />;
  }

  if (!courts?.length) {
    return (
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>No Courts Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You haven't added any courts yet. Please add a court to manage events.
            </p>
            <Button className="mt-4" onClick={() => window.location.href = '/venue-owner/courts'}>
              Go to Courts
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Manage Events</h1>
        <CourtDropdown 
          courts={courts} 
          selectedCourt={selectedCourt}
          onSelect={setSelectedCourt}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <Suspense fallback={<EventsSkeleton />}>
          {selectedCourt && (
            <SportsEventManagement 
              key={selectedCourt.courtId} // Force re-mount when court changes
              courtId={selectedCourt.courtId} 
            />
          )}
        </Suspense>
      </div>
    </div>
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

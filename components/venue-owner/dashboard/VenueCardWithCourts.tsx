"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/store/hooks";
import { useGetVenueDetailsQuery } from "@/redux/api/venue-owner/venueApi";
import { useGetCourtsQuery } from "@/redux/api/venue-owner/courtApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Edit,
  MapPin,
  Phone,
  Mail,
  Clock,
  ImageIcon,
  PlusCircle,
} from "lucide-react";
import { EditVenueDialog } from "./edit-venue-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function VenueCardWithCourts() {
  // Get the current user's ID from localStorage
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get user ID from localStorage when component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          console.log("User data from localStorage:", user);
          // Try to get userId from different possible locations in the user object
          const userId = user?.id || user?.userId || user?.user_id || null;
          setCurrentUserId(userId);
          console.log("Using userId from localStorage:", userId);
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error);
        }
      } else {
        console.log("No user data found in localStorage");
      }
    }
  }, []);

  const {
    data: venueDetails,
    isLoading,
    isError,
    error,
  } = useGetVenueDetailsQuery(
    { userId: currentUserId || "" },
    {
      skip: !currentUserId, // Skip query if no user ID is available
      refetchOnMountOrArgChange: true,
    }
  );

  // Get courts - removed venueId parameter as API doesn't accept it
  const {
    data: courts = [],
    isLoading: isLoadingCourts,
    isError: isCourtsError,
  } = useGetCourtsQuery();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (isLoading || isLoadingCourts) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Venue Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || isCourtsError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Venue Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600">
            Error loading venue details. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!venueDetails) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Venue Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            No venue details found.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Venue Details</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Venue
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Venue Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Address:</span>
              <span>{venueDetails.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Phone:</span>
              <span>{venueDetails.phoneNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Email:</span>
              <span>{venueDetails.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Hours:</span>
              <span>
                {venueDetails.openingTime} - {venueDetails.closingTime}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={venueDetails.isActive ? "default" : "secondary"}>
                {venueDetails.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            {venueDetails.description && (
              <div>
                <span className="font-medium">Description:</span>
                <p className="text-sm text-muted-foreground mt-1">
                  {venueDetails.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Courts Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Courts</h3>
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Court
            </Button>
          </div>

          {courts.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No courts available. Add your first court to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courts.map((court) => (
                <Card key={court.courtId} className="p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">{court.courtName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {court.surfaceType} • Capacity: {court.capacity}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${court.hourlyRate}/hour
                    </p>
                    <Badge variant={court.isActive ? "default" : "secondary"}>
                      {court.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <EditVenueDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        venue={venueDetails}
      />
    </Card>
  );
}

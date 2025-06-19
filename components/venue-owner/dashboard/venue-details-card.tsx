"use client"

import { useState, useEffect } from "react"
import { useAppSelector } from "@/redux/store/hooks"
import { useGetVenueDetailsQuery } from "@/redux/api/venue/venueApi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Edit, MapPin, Phone, Mail, Clock, ImageIcon, PlusCircle } from "lucide-react"
import { EditVenueDialog } from "./edit-venue-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function VenueDetailsCard() {
  // Get the current user's ID from localStorage
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Get user ID from localStorage when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          console.log('User data from localStorage:', user);
          // Try to get userId from different possible locations in the user object
          const userId = user?.id || user?.userId || user?.user_id || null;
          setCurrentUserId(userId);
          console.log('Using userId from localStorage:', userId);
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
        }
      } else {
        console.log('No user data found in localStorage');
      }
    }
  }, []);
  
  const { data: venueDetails, isLoading, isError, error } = useGetVenueDetailsQuery(
    { userId: currentUserId || '' },
    { 
      skip: !currentUserId, // Skip query if no user ID is available
      refetchOnMountOrArgChange: true,
    }
  )
  
  // Debug: Log the current state
  useEffect(() => {
    console.log('VenueDetailsCard state:', {
      currentUserId,
      isLoading,
      isError,
      error,
      venueDetails,
      localStorageUser: typeof window !== 'undefined' ? localStorage.getItem('user') : null
    });
  }, [currentUserId, isLoading, isError, error, venueDetails])
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Open edit dialog when edit button is clicked
  const handleEditClick = () => {
    setIsEditDialogOpen(true)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-32">
          <p className="text-destructive">Error loading venue details.</p>
        </CardContent>
      </Card>
    )
  }

  // If no venue details are available yet, show a message
  if (!venueDetails) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-32 space-y-2">
          <p className="text-muted-foreground">No venue details available</p>
          <Button variant="outline" size="sm" onClick={handleEditClick}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Venue Details
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Debug: Log the venue details to console
  console.log('Venue details:', venueDetails)

  return (
    <>
      <Card className="relative">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Venue Details</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEditClick}
            disabled={!venueDetails}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-6">
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{venueDetails.venueName}</h3>
                <Badge variant={venueDetails.isActive ? "default" : "secondary"}>
                  {venueDetails.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {venueDetails.address}, {venueDetails.cityName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{venueDetails.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{venueDetails.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {venueDetails.openingTime && venueDetails.closingTime
                      ? `${venueDetails.openingTime} - ${venueDetails.closingTime}`
                      : "Hours not set"}
                  </span>
                </div>
              </div>

              {venueDetails.desc && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{venueDetails.desc}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Venue Images</h4>
              <div className="grid grid-cols-2 gap-2">
                {venueDetails.venueImage && venueDetails.venueImage.length > 0 ? (
                  venueDetails.venueImage.slice(0, 4).map((image, index) => (
                    <Avatar key={image.imageId} className="h-16 w-16 rounded-md">
                      <AvatarImage src={image.imageUrl || "/placeholder.svg"} alt={`Venue ${index + 1}`} />
                      <AvatarFallback className="rounded-md">
                        <ImageIcon className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                  ))
                ) : (
                  <div className="col-span-2 flex items-center justify-center h-16 border-2 border-dashed border-muted-foreground/25 rounded-md">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              {venueDetails.venueImage && venueDetails.venueImage.length > 4 && (
                <p className="text-xs text-muted-foreground">+{venueDetails.venueImage.length - 4} more images</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {venueDetails && (
        <EditVenueDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          venue={venueDetails}
        />
      )}
    </>
  )
}

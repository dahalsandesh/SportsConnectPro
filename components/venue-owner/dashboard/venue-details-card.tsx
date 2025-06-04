"use client"

import { useState } from "react"
import { useGetVenueDetailsQuery } from "@/redux/api/venueManagementApi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Edit, MapPin, Phone, Mail, Clock, ImageIcon } from "lucide-react"
import { EditVenueDialog } from "./edit-venue-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function VenueDetailsCard() {
  const { data: venueDetails, isLoading, isError } = useGetVenueDetailsQuery()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (isError || !venueDetails) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-32">
          <p className="text-destructive">Error loading venue details.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Venue Details</CardTitle>
          <Button onClick={() => setIsEditDialogOpen(true)} variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Details
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

      <EditVenueDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} venueDetails={venueDetails} />
    </>
  )
}

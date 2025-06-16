import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useGetCourtsQuery } from "@/redux/api/venueManagementApi"
import { SlotManagement } from "./SlotManagement"
import { useState } from "react"

type Venue = {
  venueId: string
  name: string
  address: string
  cityName: string
  phoneNumber: string
  email: string
  createdAt: string
}

type Court = {
  courtId: string
  courtName: string
  surfaceType: string
  hourlyRate: number
  capacity: number
}

type VenueCardWithCourtsProps = {
  venue: Venue
}

export function VenueCardWithCourts({ venue }: VenueCardWithCourtsProps) {
  const [openSlotCourtId, setOpenSlotCourtId] = useState<string | null>(null)
  const { data: courts = [], isLoading, isError } = useGetCourtsQuery({ venueId: venue.venueId })

  return (
    <Card className="overflow-hidden h-full">
      <CardHeader>
        <CardTitle>{venue.name}</CardTitle>
        <CardDescription>{venue.address}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-2">City: {venue.cityName}</div>
        <div className="text-sm text-muted-foreground mb-2">Phone: {venue.phoneNumber}</div>
        <div className="text-sm text-muted-foreground mb-2">Email: {venue.email}</div>
        <div className="text-xs text-muted-foreground mb-2">
          Created: {new Date(venue.createdAt).toISOString().slice(0, 10)}
        </div>

        <div className="mt-4">
          <div className="font-semibold mb-2">Courts:</div>
          {isLoading && <div className="text-sm text-muted-foreground">Loading courts...</div>}
          {isError && <div className="text-sm text-destructive">Failed to load courts.</div>}
          {!isLoading && !isError && courts.length === 0 && (
            <div className="text-sm text-muted-foreground">No courts found for this venue.</div>
          )}
          {!isLoading && !isError && courts.length > 0 && (
            <ul className="space-y-2">
              {(courts as Court[]).map((court) => (
                <li key={court.courtId} className="border rounded-md p-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{court.courtName}</div>
                      <div className="text-xs text-muted-foreground">
                        {court.surfaceType} •Rs.{court.hourlyRate}/hr • {court.capacity} players
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setOpenSlotCourtId(openSlotCourtId === court.courtId ? null : court.courtId)
                      }
                    >
                      {openSlotCourtId === court.courtId ? "Hide Slots" : "Manage Slots"}
                    </Button>
                  </div>
                  {openSlotCourtId === court.courtId && (
                    <div className="mt-2 pt-2 border-t">
                      <SlotManagement courtId={court.courtId} date={new Date().toISOString().slice(0, 10)} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

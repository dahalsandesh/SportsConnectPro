"use client";

import { useState } from "react";
import { useGetAdminVenuesQuery, useGetVenueDetailsQuery } from "@/redux/api/admin/venueApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { VenuesTable } from "./venues-table";
import { PlusCircle, Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CreateVenueDialog } from "./create-venue-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function VenuesClient() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Fetch venue details when a venue is selected
  const { data: venueDetails, isLoading: isLoadingVenueDetails } = useGetVenueDetailsQuery(
    selectedVenueId || '',
    { skip: !selectedVenueId }
  );

  const handleViewDetails = (venue) => {
    setSelectedVenueId(venue.venueID);
    setIsDetailsModalOpen(true);
  };

  const { data: venues, error, isLoading } = useGetAdminVenuesQuery();

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load venues. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <Tabs defaultValue="all-venues" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all-venues">All Venues</TabsTrigger>
            <TabsTrigger value="active-venues">Active Venues</TabsTrigger>
            <TabsTrigger value="inactive-venues">Inactive Venues</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search venues..."
                className="w-64 pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Venue
            </Button>
          </div>
        </div>

        <TabsContent value="all-venues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Venues</CardTitle>
              <CardDescription>
                Manage all venues of the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VenuesTable
                venues={venues || []}
                isLoading={isLoading}
                searchQuery={searchQuery}
                filter="all"
                onViewDetails={handleViewDetails}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active-venues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Venues</CardTitle>
              <CardDescription>
                Manage active venues of the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VenuesTable
                venues={venues || []}
                isLoading={isLoading}
                searchQuery={searchQuery}
                filter="active"
                onViewDetails={handleViewDetails}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive-venues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inactive Venues</CardTitle>
              <CardDescription>
                Manage inactive venues of the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VenuesTable
                venues={venues || []}
                isLoading={isLoading}
                searchQuery={searchQuery}
                filter="inactive"
                onViewDetails={handleViewDetails}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateVenueDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    {/* Venue Details Modal */}
    <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Venue Details</DialogTitle>
        </DialogHeader>
        {isLoadingVenueDetails ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : venueDetails ? (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium">Name:</span>
              <span className="col-span-3">{venueDetails.name}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium">Address:</span>
              <span className="col-span-3">{venueDetails.address}, {venueDetails.city}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium">Phone:</span>
              <span className="col-span-3">{venueDetails.phoneNumber}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium">Email:</span>
              <span className="col-span-3">{venueDetails.email}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium">Status:</span>
              <span className="col-span-3">
                <Badge variant={venueDetails.isActive ? "default" : "secondary"}>
                  {venueDetails.isActive ? "Active" : "Inactive"}
                </Badge>
              </span>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <span className="text-sm font-medium">Description:</span>
              <p className="col-span-3 text-sm text-muted-foreground">
                {venueDetails.description || "No description provided"}
              </p>
            </div>
            
            {/* Owner Information */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-sm font-medium mb-3">Owner Information</h4>
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-4 sm:col-span-2">
                  <div className="text-sm font-medium">Name</div>
                  <div className="text-sm text-muted-foreground">
                    {venueDetails.owner?.firstName} {venueDetails.owner?.lastName}
                  </div>
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <div className="text-sm font-medium">Email</div>
                  <div className="text-sm text-muted-foreground">
                    {venueDetails.owner?.email}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Information */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-sm font-medium mb-3">Additional Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Created At</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(venueDetails.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Number of Courts</div>
                  <div className="text-sm text-muted-foreground">
                    {venueDetails.courts?.length || 0}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Number of Images</div>
                  <div className="text-sm text-muted-foreground">
                    {venueDetails.venueImages?.length || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Unable to load venue details. Please try again.
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
}

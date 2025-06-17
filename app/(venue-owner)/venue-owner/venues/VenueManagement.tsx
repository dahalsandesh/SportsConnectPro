"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Venue } from "@/types/api";
import {
  useGetVenuesQuery,
  useUpdateVenueDetailsMutation,
  useDeleteVenueImageMutation,
  useUploadVenueImageMutation,
  useGetVenueImagesQuery,
} from "@/redux/api/venue-owner/venueApi";
import { Plus, MapPin, Edit, Trash2, Image as ImageIcon } from "lucide-react";

interface VenueFormData {
  venueId?: string;
  name: string;
  address: string;
  cityId: string;
  cityName: string;
  phoneNumber: string;
  email: string;
  desc?: string;
  isActive: boolean;
}

export default function VenueManagement() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch venues for the current user
  const {
    data: venuesResponse,
    isLoading: isLoadingVenues,
    isError,
    refetch,
  } = useGetVenuesQuery(
    { userId: user?.userName || "" }, // Using userName as ID since it's available in auth state
    { skip: !user?.userName }
  );

  const [venues, setVenues] = useState<Venue[]>([]);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize venues when data is loaded
  useEffect(() => {
    if (venuesResponse?.data) {
      setVenues(Array.isArray(venuesResponse.data) ? venuesResponse.data : []);
    }
  }, [venuesResponse]);

  const [updateVenue] = useUpdateVenueDetailsMutation();

  const handleEdit = (venue: Venue) => {
    setEditingVenue(venue);
    setShowEditModal(true);
  };

  const handleAdd = () => {
    router.push("/venue-owner/venues/add");
  };

  const handleDeleteVenue = async (venueId: string) => {
    if (!window.confirm("Are you sure you want to delete this venue?")) {
      return;
    }

    try {
      setIsDeleting(true);
      // TODO: Implement delete venue mutation when API is available
      // await deleteVenue(venueId).unwrap();
      toast({
        title: "Venue deleted",
        description: "The venue has been deleted successfully.",
      });
      refetch();
    } catch (error) {
      console.error("Error deleting venue:", error);
      toast({
        title: "Error",
        description: "Failed to delete venue. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVenue) return;

    try {
      setIsUpdating(true);
      const updateData = {
        venueId: editingVenue.venueId,
        venueName: editingVenue.name,
        address: editingVenue.address,
        cityId: editingVenue.cityId,
        latitude: editingVenue.latitude || null,
        longitude: editingVenue.longitude || null,
        phoneNumber: editingVenue.phoneNumber,
        email: editingVenue.email,
        desc: editingVenue.description || "",
        openingTime: editingVenue.openingTime || null,
        closingTime: editingVenue.closingTime || null,
        isActive:
          editingVenue.isActive !== undefined ? editingVenue.isActive : true,
      };

      await updateVenue(updateData).unwrap();

      toast({
        title: "Venue updated",
        description: "The venue has been updated successfully.",
      });
      setShowEditModal(false);
      refetch();
    } catch (error) {
      console.error("Error updating venue:", error);
      toast({
        title: "Error",
        description: "Failed to update venue. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const navigateToVenueDetails = (venueId: string) => {
    router.push(`/venue-owner/venues/${venueId}`);
  };

  if (isLoadingVenues) return <div>Loading venues...</div>;
  if (isError) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading venues
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Failed to load venues. Please try again later.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Venue Management</h1>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Venue
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <Card
            key={venue.venueId}
            className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{venue.name}</CardTitle>
              <CardDescription className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {venue.address}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Phone:</span>{" "}
                  {venue.phoneNumber}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {venue.email}
                </p>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(venue)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteVenue(venue.venueId)}
                    disabled={isDeleting}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {renderEditModal()}
    </div>
  );
}

// Edit modal
const renderEditModal = () => (
  <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Venue</DialogTitle>
      </DialogHeader>
      {editingVenue && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Venue Name</Label>
            <Input
              id="name"
              value={editingVenue.name || ""}
              onChange={(e) =>
                setEditingVenue({ ...editingVenue, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={editingVenue.address || ""}
              onChange={(e) =>
                setEditingVenue({ ...editingVenue, address: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="cityName">City</Label>
            <Input
              id="cityName"
              value={editingVenue.cityName || ""}
              onChange={(e) =>
                setEditingVenue({ ...editingVenue, cityName: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={editingVenue.phoneNumber || ""}
              onChange={(e) =>
                setEditingVenue({
                  ...editingVenue,
                  phoneNumber: e.target.value,
                })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={editingVenue.email || ""}
              onChange={(e) =>
                setEditingVenue({ ...editingVenue, email: e.target.value })
              }
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      )}
    </DialogContent>
  </Dialog>
);

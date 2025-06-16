"use client";

import { useState } from "react";
import {
  useGetVenueDetailsQuery,
  useUpdateVenueDetailsMutation,
} from "@/redux/api/venueManagementApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, MapPin, Edit, Trash2, Image, Layers } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function VenueManagement() {
  const { data, isLoading, error } = useGetVenueDetailsQuery();
  const [editVenue, setEditVenue] = useState<any | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState<any>({});
  const [updateVenue] = useUpdateVenueDetailsMutation();

  // Handle both array and single object responses
  const venues = Array.isArray(data) ? data : data ? [data] : [];

  const handleEdit = (venue: any) => {
    setEditVenue(venue);
    setForm({ ...venue });
    setShowEditModal(true);
  };

  const handleAdd = () => {
    setForm({
      venueName: "",
      address: "",
      cityName: "",
      phoneNumber: "",
      email: "",
      desc: "",
    });
    setShowAddModal(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await updateVenue(form);
    setShowEditModal(false);
    setShowAddModal(false);
  };

  if (isLoading) return <div>Loading venues...</div>;
  if (error) return <div>Error loading venues.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Venues</h2>
          <p className="text-muted-foreground">
            Manage your sports venues and facilities
          </p>
        </div>
        <Button className="bg-primary text-white" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Venue
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {venues.map((venue: any) => (
          <Card key={venue.venueId}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {venue.venueName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {venue.venueImage && venue.venueImage.length > 0 ? (
                    <img
                      src={venue.venueImage[0].image}
                      alt="Venue"
                      className="w-20 h-20 object-cover rounded"
                    />
                  ) : (
                    <div className="w-20 h-20 flex items-center justify-center bg-muted rounded">
                      <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {venue.desc}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Location:</span>
                      <span>{venue.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">City:</span>
                      <span>{venue.cityName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Phone:</span>
                      <span>{venue.phoneNumber}</span>
                    </div>
                  </div>
                </div>
                {/* Courts List */}
                {venue.courts && venue.courts.length > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 font-semibold text-sm mb-1">
                      <Layers className="h-4 w-4" /> Courts
                    </div>
                    <ul className="ml-2 list-disc text-xs">
                      {venue.courts.map((court: any) => (
                        <li key={court.courtId}>
                          {court.courtName} ({court.surfaceType},{" "}
                          {court.capacity}p)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-primary"
                    onClick={() => handleEdit(venue)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Venue Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Venue</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              name="venueName"
              value={form.venueName || ""}
              onChange={handleFormChange}
              placeholder="Venue Name"
            />
            <Input
              name="address"
              value={form.address || ""}
              onChange={handleFormChange}
              placeholder="Address"
            />
            <Input
              name="cityName"
              value={form.cityName || ""}
              onChange={handleFormChange}
              placeholder="City"
            />
            <Input
              name="phoneNumber"
              value={form.phoneNumber || ""}
              onChange={handleFormChange}
              placeholder="Phone"
            />
            <Input
              name="email"
              value={form.email || ""}
              onChange={handleFormChange}
              placeholder="Email"
            />
            <Textarea
              name="desc"
              value={form.desc || ""}
              onChange={handleFormChange}
              placeholder="Description"
            />
          </div>
          <DialogFooter>
            <Button className="bg-primary text-white" onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Venue Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Venue</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              name="venueName"
              value={form.venueName || ""}
              onChange={handleFormChange}
              placeholder="Venue Name"
            />
            <Input
              name="address"
              value={form.address || ""}
              onChange={handleFormChange}
              placeholder="Address"
            />
            <Input
              name="cityName"
              value={form.cityName || ""}
              onChange={handleFormChange}
              placeholder="City"
            />
            <Input
              name="phoneNumber"
              value={form.phoneNumber || ""}
              onChange={handleFormChange}
              placeholder="Phone"
            />
            <Input
              name="email"
              value={form.email || ""}
              onChange={handleFormChange}
              placeholder="Email"
            />
            <Textarea
              name="desc"
              value={form.desc || ""}
              onChange={handleFormChange}
              placeholder="Description"
            />
          </div>
          <DialogFooter>
            <Button className="bg-primary text-white" onClick={handleSave}>
              Add Venue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

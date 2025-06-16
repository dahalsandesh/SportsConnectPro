"use client";

import React, { useState } from "react";
import {
  useGetCourtsQuery,
  useCreateCourtMutation,
  useUpdateCourtMutation,
  useDeleteCourtMutation,
} from "@/redux/api/venueManagementApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CourtManagementProps {
  venueId: string;
}

export default function CourtManagement({ venueId }: CourtManagementProps) {
  const { toast } = useToast();
  const {
    data: courts = [],
    isLoading,
    refetch,
  } = useGetCourtsQuery({ venueId });
  const [createCourt] = useCreateCourtMutation();
  const [updateCourt] = useUpdateCourtMutation();
  const [deleteCourt] = useDeleteCourtMutation();

  const [isAddingCourt, setIsAddingCourt] = useState(false);
  const [editingCourt, setEditingCourt] = useState<any>(null);
  const [formData, setFormData] = useState({
    courtName: "",
    surfaceType: "",
    capacity: "",
    hourlyRate: "",
    description: "",
    courtImage: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, courtImage: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(key, value);
        }
      });
      formDataToSend.append("venueId", venueId);

      if (editingCourt) {
        await updateCourt({
          courtId: editingCourt.courtId,
          ...formDataToSend,
        }).unwrap();
        toast({
          title: "Success",
          description: "Court updated successfully",
        });
      } else {
        await createCourt(formDataToSend).unwrap();
        toast({
          title: "Success",
          description: "Court created successfully",
        });
      }

      setIsAddingCourt(false);
      setEditingCourt(null);
      setFormData({
        courtName: "",
        surfaceType: "",
        capacity: "",
        hourlyRate: "",
        description: "",
        courtImage: null,
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: editingCourt
          ? "Failed to update court"
          : "Failed to create court",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (courtId: string) => {
    if (window.confirm("Are you sure you want to delete this court?")) {
      try {
        await deleteCourt({ courtId }).unwrap();
        toast({
          title: "Success",
          description: "Court deleted successfully",
        });
        refetch();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete court",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (court: any) => {
    setEditingCourt(court);
    setFormData({
      courtName: court.courtName,
      surfaceType: court.surfaceType,
      capacity: court.capacity.toString(),
      hourlyRate: court.hourlyRate.toString(),
      description: court.description || "",
      courtImage: null,
    });
    setIsAddingCourt(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Court Management</CardTitle>
            <CardDescription>Manage courts for your venue</CardDescription>
          </div>
          <Button onClick={() => setIsAddingCourt(true)}>Add New Court</Button>
        </div>
      </CardHeader>
      <CardContent>
        {isAddingCourt ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="courtName">Court Name</Label>
                <Input
                  id="courtName"
                  name="courtName"
                  value={formData.courtName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="surfaceType">Surface Type</Label>
                <Select
                  value={formData.surfaceType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, surfaceType: value }))
                  }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select surface type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hard">Hard Court</SelectItem>
                    <SelectItem value="clay">Clay Court</SelectItem>
                    <SelectItem value="grass">Grass Court</SelectItem>
                    <SelectItem value="synthetic">Synthetic Court</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate (Rs.)</Label>
                <Input
                  id="hourlyRate"
                  name="hourlyRate"
                  type="number"
                  value={formData.hourlyRate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="courtImage">Court Image</Label>
              <Input
                id="courtImage"
                name="courtImage"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editingCourt ? "Update Court" : "Create Court"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddingCourt(false);
                  setEditingCourt(null);
                  setFormData({
                    courtName: "",
                    surfaceType: "",
                    capacity: "",
                    hourlyRate: "",
                    description: "",
                    courtImage: null,
                  });
                }}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {isLoading ? (
              <div>Loading courts...</div>
            ) : courts.length === 0 ? (
              <div className="text-muted-foreground">
                No courts found for this venue.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courts.map((court: any) => (
                  <Card key={court.courtId}>
                    <CardContent className="pt-6">
                      {court.courtImageUrl && (
                        <img
                          src={court.courtImageUrl}
                          alt={court.courtName}
                          className="w-full h-48 object-cover rounded-md mb-4"
                        />
                      )}
                      <h3 className="font-semibold text-lg">
                        {court.courtName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Surface: {court.surfaceType}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Capacity: {court.capacity} players
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Rate: Rs.{court.hourlyRate}/hr
                      </p>
                      {court.description && (
                        <p className="text-sm mt-2">{court.description}</p>
                      )}
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(court)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(court.courtId)}>
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

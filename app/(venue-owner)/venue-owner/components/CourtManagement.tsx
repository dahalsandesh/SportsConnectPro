"use client";

import React, { useState } from "react";
import {
  useGetCourtsQuery,
  useCreateCourtMutation,
  useUpdateCourtMutation,
  useDeleteCourtMutation,
} from "@/redux/api/venue-owner/courtApi";
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
  const { data: courts = [], isLoading, refetch } = useGetCourtsQuery();
  const [createCourt] = useCreateCourtMutation();
  const [updateCourt] = useUpdateCourtMutation();
  const [deleteCourt] = useDeleteCourtMutation();

  const [isAddingCourt, setIsAddingCourt] = useState(false);
  const [editingCourt, setEditingCourt] = useState<any>(null);
  const [formData, setFormData] = useState({
    courtName: "",
    courtCategoryId: "",
    surfaceType: "",
    capacity: "",
    hourlyRate: "",
    desc: "",
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
      if (editingCourt) {
        const updateData = {
          courtId: editingCourt.courtId,
          courtName: formData.courtName,
          courtCategoryId: formData.courtCategoryId,
          hourlyRate: formData.hourlyRate,
          capacity: formData.capacity,
          surfaceType: formData.surfaceType,
          desc: formData.desc,
          isActive: "1",
        };

        await updateCourt(updateData).unwrap();
        toast({
          title: "Success",
          description: "Court updated successfully",
        });
      } else {
        const createData = {
          courtName: formData.courtName,
          courtCategoryId: formData.courtCategoryId,
          hourlyRate: formData.hourlyRate,
          capacity: formData.capacity,
          surfaceType: formData.surfaceType,
          desc: formData.desc,
        };

        await createCourt(createData).unwrap();
        toast({
          title: "Success",
          description: "Court created successfully",
        });
      }

      setIsAddingCourt(false);
      setEditingCourt(null);
      setFormData({
        courtName: "",
        courtCategoryId: "",
        surfaceType: "",
        capacity: "",
        hourlyRate: "",
        desc: "",
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
      courtCategoryId: court.courtCategoryId || "",
      surfaceType: court.surfaceType,
      capacity: court.capacity.toString(),
      hourlyRate: court.hourlyRate.toString(),
      desc: court.desc || "",
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
                <Label htmlFor="courtCategoryId">Court Category ID</Label>
                <Input
                  id="courtCategoryId"
                  name="courtCategoryId"
                  value={formData.courtCategoryId}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <SelectItem value="Artificial Grass">
                      Artificial Grass
                    </SelectItem>
                    <SelectItem value="Wood">Wood</SelectItem>
                    <SelectItem value="Concrete">Concrete</SelectItem>
                    <SelectItem value="Clay">Clay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate</Label>
                <Input
                  id="hourlyRate"
                  name="hourlyRate"
                  type="number"
                  value={formData.hourlyRate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Input
                  id="desc"
                  name="desc"
                  value={formData.desc}
                  onChange={handleInputChange}
                />
              </div>
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
                {editingCourt ? "Update" : "Create"} Court
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddingCourt(false);
                  setEditingCourt(null);
                  setFormData({
                    courtName: "",
                    courtCategoryId: "",
                    surfaceType: "",
                    capacity: "",
                    hourlyRate: "",
                    desc: "",
                    courtImage: null,
                  });
                }}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courts.map((court) => (
              <Card key={court.courtId}>
                <CardHeader>
                  <CardTitle>{court.courtName}</CardTitle>
                  <CardDescription>
                    {court.surfaceType} • Capacity: {court.capacity}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Hourly Rate: ${court.hourlyRate}
                  </p>
                  {court.desc && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {court.desc}
                    </p>
                  )}
                </CardContent>
                <CardContent className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(court)}>
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(court.courtId)}>
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

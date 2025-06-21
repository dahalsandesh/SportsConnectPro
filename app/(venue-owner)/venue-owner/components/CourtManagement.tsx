"use client";

import React, { useState, useEffect } from "react";
import {
  useGetCourtsQuery,
  useCreateCourtMutation,
  useUpdateCourtMutation,
  useDeleteCourtMutation,
} from "@/redux/api/venue-owner/courtApi";
import { useGetSportCategoriesQuery } from "@/redux/api/venue-owner/sportCategoryApi";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Plus, Edit, Trash2, X, Save, Upload, Image as ImageIcon, LayoutGrid, Calendar } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";

interface CourtManagementProps {
  venueId: string;
}

interface CourtFormData {
  courtName: string;
  courtCategoryId: string;
  surfaceType: string;
  capacity: string;
  hourlyRate: string;
  desc: string;
  courtImage: File | null;
  isActive: boolean;
}

export default function CourtManagement({ venueId }: CourtManagementProps) {
  const { toast } = useToast();
  const { data: courts = [], isLoading, refetch } = useGetCourtsQuery();
  const { data: sportCategories = [], isLoading: isLoadingCategories } = useGetSportCategoriesQuery();
  const [createCourt, { isLoading: isCreating }] = useCreateCourtMutation();
  const [updateCourt, { isLoading: isUpdating }] = useUpdateCourtMutation();
  const [deleteCourt, { isLoading: isDeleting }] = useDeleteCourtMutation();

  const [isAddingCourt, setIsAddingCourt] = useState(false);
  const [editingCourt, setEditingCourt] = useState<any>(null);
  const [formData, setFormData] = useState<CourtFormData>({
    courtName: "",
    courtCategoryId: "",
    surfaceType: "",
    capacity: "",
    hourlyRate: "",
    desc: "",
    courtImage: null,
    isActive: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, courtImage: e.target.files![0] }));
    }
  };

  const toggleCourtStatus = async (courtId: string, currentStatus: boolean) => {
    try {
      await updateCourt({
        courtId,
        isActive: !currentStatus,
      }).unwrap();
      toast({
        title: "Success",
        description: `Court ${currentStatus ? 'deactivated' : 'activated'} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update court status",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      courtName: "",
      courtCategoryId: "",
      surfaceType: "",
      capacity: "",
      hourlyRate: "",
      desc: "",
      courtImage: null,
      isActive: true,
    });
    setEditingCourt(null);
  };

  const handleEditCourt = (court: any) => {
    setEditingCourt(court);
    setFormData({
      courtName: court.courtName,
      courtCategoryId: court.courtCategoryId,
      surfaceType: court.surfaceType || "",
      capacity: court.capacity?.toString() || "",
      hourlyRate: court.hourlyRate?.toString() || "",
      desc: court.desc || "",
      courtImage: null,
      isActive: court.isActive,
    });
    setIsAddingCourt(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const commonData = {
        courtName: formData.courtName,
        courtCategoryId: formData.courtCategoryId,
        hourlyRate: parseFloat(formData.hourlyRate) || 0,
        capacity: parseInt(formData.capacity) || 0,
        surfaceType: formData.surfaceType,
        desc: formData.desc,
        isActive: formData.isActive ? "1" : "0",
      };

      if (editingCourt) {
        await updateCourt({
          courtId: editingCourt.courtId,
          ...commonData,
        }).unwrap();
        toast({
          title: "Success",
          description: "Court updated successfully",
        });
      } else {
        await createCourt(commonData).unwrap();
        toast({
          title: "Success",
          description: "Court created successfully",
        });
      }

      setIsAddingCourt(false);
      resetForm();
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
    if (window.confirm("Are you sure you want to delete this court? This action cannot be undone.")) {
      try {
        await deleteCourt({ courtId }).unwrap();
        toast({
          title: "Success",
          description: "Court deleted successfully",
        });
        refetch();
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: error?.data?.message || "Failed to delete court. Please try again.",
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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Court Management</h2>
          <p className="text-muted-foreground">
            Manage your sports courts and their availability
          </p>
        </div>
        <Button 
          onClick={() => {
            resetForm();
            setIsAddingCourt(true);
          }}
          disabled={isAddingCourt}
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Court
        </Button>
      </div>

      {/* Add/Edit Court Form */}
      {isAddingCourt && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingCourt ? 'Edit Court' : 'Add New Court'}</CardTitle>
            <CardDescription>
              {editingCourt 
                ? 'Update the court details below.' 
                : 'Fill in the details to add a new court to your venue.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Court Name */}
                <div className="space-y-2">
                  <Label htmlFor="courtName">Court Name *</Label>
                  <Input
                    id="courtName"
                    name="courtName"
                    value={formData.courtName}
                    onChange={handleInputChange}
                    placeholder="E.g., Main Football Field"
                    required
                  />
                </div>

                {/* Sport Category */}
                <div className="space-y-2">
                  <Label htmlFor="courtCategoryId">Sport Category *</Label>
                  <Select
                    value={formData.courtCategoryId}
                    onValueChange={(value) => handleSelectChange("courtCategoryId", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sport category" />
                    </SelectTrigger>
                    <SelectContent>
                      {sportCategories.map((category) => (
                        <SelectItem key={category.sportCategoryId} value={category.sportCategoryId}>
                          {category.sportCategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Surface Type */}
                <div className="space-y-2">
                  <Label htmlFor="surfaceType">Surface Type *</Label>
                  <Input
                    id="surfaceType"
                    name="surfaceType"
                    value={formData.surfaceType}
                    onChange={handleInputChange}
                    placeholder="E.g., Artificial Grass, Hard Court"
                    required
                  />
                </div>

                {/* Capacity */}
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder="Number of players"
                  />
                </div>

                {/* Hourly Rate */}
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate (NPR) *</Label>
                  <Input
                    id="hourlyRate"
                    name="hourlyRate"
                    type="number"
                    min="0"
                    step="100"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    placeholder="E.g., 1500"
                    required
                  />
                </div>

                {/* Status Toggle */}
                <div className="space-y-2">
                  <Label htmlFor="isActive">Status</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, isActive: checked }))
                      }
                    />
                    <Label htmlFor="isActive" className="!m-0">
                      {formData.isActive ? 'Active' : 'Inactive'}
                    </Label>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="desc">Description</Label>
                  <Textarea
                    id="desc"
                    name="desc"
                    value={formData.desc}
                    onChange={handleInputChange}
                    placeholder="Add any additional details about the court..."
                    rows={3}
                  />
                </div>

                {/* Court Images */}
                <div className="space-y-2 md:col-span-2">
                  <Label>Court Images</Label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, WEBP (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  {formData.courtImage && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Selected: {(formData.courtImage as File).name}
                    </p>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddingCourt(false);
                    resetForm();
                  }}
                  disabled={isCreating || isUpdating}
                >
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isCreating || isUpdating}
                >
                  {isCreating || isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingCourt ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {editingCourt ? 'Update Court' : 'Add Court'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Courts List */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <CardTitle>Your Courts</CardTitle>
              <CardDescription>
                {courts.length} {courts.length === 1 ? 'court' : 'courts'} available
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {courts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border-b">
              <LayoutGrid className="h-12 w-12 text-muted-foreground mb-3" />
              <h4 className="text-lg font-medium mb-1">No courts added yet</h4>
              <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                Get started by adding your first court to manage bookings and availability.
              </p>
              <Button 
                onClick={() => setIsAddingCourt(true)}
                className="mt-2"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Your First Court
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {courts.map((court) => (
                <div key={court.courtId} className="p-6 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Court Image */}
                    <div className="relative w-full h-48 md:w-64 md:flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      {court.courtImage?.length > 0 ? (
                        <Image
                          src={court.courtImage[0]}
                          alt={court.courtName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    {/* Court Details */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold flex items-center">
                            {court.courtName}
                            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${court.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {court.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </h3>
                          <p className="text-sm text-muted-foreground capitalize">
                            {court.courtCategory}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleCourtStatus(court.courtId, court.isActive)}
                            className="text-xs"
                          >
                            {court.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCourt(court)}
                          >
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(court.courtId)}
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Surface</p>
                          <p className="font-medium">{court.surfaceType || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Capacity</p>
                          <p className="font-medium">{court.capacity || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Hourly Rate</p>
                          <p className="font-medium">NPR {court.hourlyRate}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <div className="flex items-center">
                            <span className={`w-2 h-2 rounded-full mr-2 ${court.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                            <span>{court.isActive ? 'Available' : 'Unavailable'}</span>
                          </div>
                        </div>
                      </div>
                      
                      {court.desc && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-muted-foreground">
                            {court.desc}
                          </p>
                        </div>
                      )}
                      
                      <div className="mt-6 flex flex-wrap gap-3">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/venue-owner/availability?courtId=${court.courtId}`}>
                            <Calendar className="mr-2 h-4 w-4" /> Manage Slots
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/courts/${court.courtId}`}>
                            View Public Page
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

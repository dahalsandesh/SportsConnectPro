"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Edit, MapPin, Phone, Mail, Clock, PlusCircle, Image as ImageIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useGetVenueDetailsQuery, useUpdateVenueDetailsMutation, useUploadVenueImageMutation, useDeleteVenueImageMutation } from "@/redux/api/venue-owner/venueApi";
import { useGetCourtsQuery } from "@/redux/api/venue-owner/courtApi";
import EditVenueDialog from "./EditVenueDialog";

export default function VenueCardWithCourts() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Get user ID from localStorage when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          const userId = user?.id || user?.userId || user?.user_id;
          if (userId) {
            setCurrentUserId(userId);
          }
        }
      } catch (error) {
        console.error('Error getting user ID:', error);
        toast.error('Failed to load user data');
      }
    }
  }, []);

  // Fetch venue details using RTK Query
  const {
    data: venueData,
    isLoading,
    isError,
    error: venueError,
    refetch: refetchVenue
  } = useGetVenueDetailsQuery(
    { userId: currentUserId || '' },
    { 
      skip: !currentUserId,
      refetchOnMountOrArgChange: true
    }
  );
  
  // Mutations
  const [updateVenueDetails] = useUpdateVenueDetailsMutation();
  const [uploadVenueImage] = useUploadVenueImageMutation();
  const [deleteVenueImage] = useDeleteVenueImageMutation();
  
  // Handle errors
  const error = isError ? (venueError as any)?.data?.message || 'Failed to load venue details' : null;

  // Get courts for the venue
  const {
    data: courts = [],
    isLoading: isLoadingCourts,
    isError: isCourtsError,
  } = useGetCourtsQuery(undefined, {
    skip: !venueData?.venueId // Skip if we don't have a venue ID yet
  });
  
  // Handle venue update
  const handleUpdateVenue = async (data: any) => {
    if (!venueData?.venueId) {
      toast.error('No venue ID found');
      return false;
    }
    
    try {
      await updateVenueDetails({
        ...data,
        venueId: venueData.venueId,
        isActive: data.isActive ?? venueData.isActive,
      }).unwrap();
      
      toast.success('Venue updated successfully');
      await refetchVenue();
      return true;
    } catch (error) {
      console.error('Error updating venue:', error);
      toast.error('Failed to update venue');
      return false;
    }
  };
  
  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !venueData?.venueId) return;
    
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      await uploadVenueImage({
        venueId: venueData.venueId,
        file
      }).unwrap();
      
      toast.success('Image uploaded successfully');
      await refetchVenue();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset file input
    }
  };
  
  // Handle image delete
  const handleDeleteImage = async (imageId: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    
    try {
      await deleteVenueImage({ imageId }).unwrap();
      toast.success('Image deleted successfully');
      await refetchVenue();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading venue details...</span>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <p>Error: {error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => refetchVenue()}
        >
          Retry
        </Button>
      </div>
    );
  }
  
  // No venue data
  if (!venueData) {
    return (
      <div className="text-center p-8">
        <p>No venue found for your account.</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => refetchVenue()}
        >
          Refresh
        </Button>
      </div>
    );
  }

  // Extract data for easier access
  const {
    venueName,
    address,
    cityName,
    phoneNumber,
    email,
    desc: description,
    openingTime,
    closingTime,
    isActive,
    venueImage: venueImages = []
  } = venueData;

  return (
    <div className="space-y-6">
      {/* Venue Details Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">{venueName}</CardTitle>
              <CardDescription className="mt-1">
                {address}, {cityName}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isActive ? "default" : "secondary"}>
                {isActive ? "Active" : "Inactive"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Venue
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Venue Images */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Venue Images</h3>
              <div>
                <label className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 cursor-pointer">
                  <ImageIcon className="h-4 w-4 mr-1" />
                  Upload Image
                  <Input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>
            {venueImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {venueImages.map((image: any) => (
                  <div key={image.id} className="relative group">
                    <div className="aspect-video rounded-md overflow-hidden bg-gray-100">
                      <img
                        src={image.image}
                        alt={`Venue ${venueName}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2">No images uploaded yet</p>
              </div>
            )}
            {isUploading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span>Uploading image...</span>
              </div>
            )}
          </div>

          {/* Venue Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{address}, {cityName}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{phoneNumber || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{email || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Opening Hours</p>
                  <p className="text-sm text-muted-foreground">
                    {openingTime && closingTime 
                      ? `${openingTime} - ${closingTime}`
                      : 'Not specified'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <div className="p-4 bg-muted/50 rounded-md">
                  {description ? (
                    <p className="text-muted-foreground">{description}</p>
                  ) : (
                    <p className="text-muted-foreground italic">No description provided</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courts Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Courts</CardTitle>
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Court
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingCourts ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : isCourtsError ? (
            <div className="text-center text-red-600 py-8">
              Error loading courts. Please try again.
            </div>
          ) : courts.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No courts available. Add your first court to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courts.map((court: any) => (
                <Card key={court.courtId} className="p-4 hover:shadow-md transition-shadow">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-lg">{court.courtName}</h4>
                      <Badge variant={court.isActive ? "default" : "secondary"}>
                        {court.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {court.surfaceType} • Capacity: {court.capacity}
                    </p>
                    <p className="text-sm font-medium">
                      ${court.hourlyRate}/hour
                    </p>
                    {court.desc && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {court.desc}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Venue Dialog */}
      <EditVenueDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        venue={venueData}
        onSave={handleUpdateVenue}
      />
    </div>
  );
}

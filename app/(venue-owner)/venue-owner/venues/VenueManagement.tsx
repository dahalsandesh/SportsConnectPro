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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuthUser } from "@/hooks/useAuthUser";
import { 
  useGetVenueDetailsQuery,
  useUpdateVenueDetailsMutation,
  useUploadVenueImageMutation,
  useDeleteVenueImageMutation,
} from "@/redux/api/venue-owner/venueApi";
import VenueLocationMapDialog from "@/components/venue-owner/VenueLocationMapDialog";
import { useGetCourtsQuery, useUpdateCourtMutation } from "@/redux/api/venue-owner/courtApi";
import { 
  Plus, 
  MapPin, 
  Edit, 
  Trash2, 
  Image as ImageIcon, 
  Clock, 
  Phone, 
  Mail, 
  Users,
  DollarSign,
  Calendar
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetCitiesQuery } from "@/redux/api/venue-owner/venueApi";
import { AddCourtDialog } from "@/components/venue-owner/AddCourtDialog";
import { EditCourtDialog } from "@/components/venue-owner/EditCourtDialog";

interface VenueDetails {
  venueId: string;
  venueName: string;
  address: string;
  cityName: string;
  phoneNumber: string;
  email: string;
  desc?: string;
  openingTime: string;
  closingTime: string;
  isActive: boolean;
  venueImage?: Array<{ id: string; image: string }>;
  courts?: Array<{
    courtId: string;
    courtName: string;
    courtType: string;
    courtCategory: string;
    hourlyRate: number;
    isActive: boolean;
    courtImage: string[];
    capacity?: number;
    desc?: string;
  }>;
}

const VenueSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-48 w-full" />
      ))}
    </div>
  </div>
);

export default function VenueManagement() {
  const router = useRouter();
  const { toast } = useToast();
  const { userId } = useAuthUser();
  const [activeTab, setActiveTab] = useState("courts"); // Default to courts tab
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingVenue, setEditingVenue] = useState<VenueDetails | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isAddCourtDialogOpen, setIsAddCourtDialogOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState<any>(null);
  
  // Get cities for dropdown
  const { data: citiesResponse = [], isLoading: isLoadingCities } = useGetCitiesQuery();
  const cities = Array.isArray(citiesResponse) ? citiesResponse : [];

  // Get venue details
  const { 
    data: venueData, 
    isLoading: isLoadingVenue, 
    isError: isVenueError,
    error: venueError,
    refetch: refetchVenue 
  } = useGetVenueDetailsQuery();

  // Court management
  const { 
    data: courtsData = [], 
    isLoading: isLoadingCourts, 
    isError: isCourtsError,
    refetch: refetchCourts 
  } = useGetCourtsQuery(undefined, {
    skip: !venueData?.venueId,
  });
  
  const [updateCourt] = useUpdateCourtMutation();
  const courts = Array.isArray(courtsData) ? courtsData : [];

  // Mutations
  const [updateVenueDetails] = useUpdateVenueDetailsMutation();
  const [uploadVenueImage] = useUploadVenueImageMutation();
  const [deleteVenueImage] = useDeleteVenueImageMutation();

  // Set editing venue when venue data is loaded
  useEffect(() => {
    if (venueData) {
      setEditingVenue({
        ...venueData,
        courts: Array.isArray(courts) ? courts : []
      });
      
      // Debug log to check if we have venue data and courts
      console.log('Venue data:', venueData);
      console.log('Courts data in effect:', courts);
    }
  }, [venueData, courts]);

  // Handle venue update
  const handleUpdateVenue = async (data: any) => {
    if (!venueData?.venueId || !userId) {
      toast({
        title: "Error",
        description: "Missing required information",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      const updateData = {
        ...data,
        venueId: venueData.venueId,
        userId: userId,
        // Convert boolean to 1 or 0 for the API
        isActive: (data.isActive ?? venueData.isActive) ? 1 : 0,
        // Ensure cityId is included in the update
        cityId: data.cityId || venueData.cityId,
      };
      
      console.log('Updating venue with data:', updateData);
      
      await updateVenueDetails(updateData).unwrap();
      
      toast({
        title: "Success",
        description: "Venue updated successfully"
      });
      
      await refetchVenue();
      return true;
    } catch (error) {
      console.error('Error updating venue:', error);
      toast({
        title: "Error",
        description: "Failed to update venue. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !venueData?.venueId || !userId) {
      console.error('Missing required data for image upload:', { 
        hasFiles: !!e.target.files?.length,
        venueId: venueData?.venueId,
        userId
      });
      return;
    }
    
    setIsUploading(true);
    try {
      // Process each file individually
      const uploadPromises = Array.from(e.target.files).map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('userId', userId);
        
        return uploadVenueImage({
          userId: userId,
          file: file
        }).unwrap();
      });
      
      // Wait for all uploads to complete
      await Promise.all(uploadPromises);
      
      // Show success message
      toast({
        title: "Success",
        description: "Image uploaded successfully"
      });
      
      // Refetch venue data to get the updated images
      try {
        await refetchVenue().unwrap();
      } catch (error) {
        console.error('Error refetching venue data:', error);
        toast({
          title: "Upload Complete",
          description: "Image uploaded, but there was an issue refreshing the page. Please refresh manually.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Error",
        description: "Failed to upload images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };
  
  // Handle image delete
  const handleDeleteImage = async (imageId: string) => {
    if (!window.confirm('Are you sure you want to delete this image?') || !userId) return;
    
    try {
      await deleteVenueImage({ imageId, userId }).unwrap();
      toast({
        title: "Success",
        description: "Image deleted successfully"
      });
      await refetchVenue();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: "Failed to delete image. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Loading state
  if (isLoadingVenue) {
    return <VenueSkeleton />;
  }
  
  // Error state
  if (isVenueError) {
    return (
      <div className="text-center p-8 text-red-600">
        <p>Error loading venue details</p>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{venueName}</h1>
          <p className="text-muted-foreground">Manage your venue details, courts, and more</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
          <Button
            variant={isEditing ? "secondary" : "outline"}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit Venue'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Venue Details</TabsTrigger>
          <TabsTrigger value="courts">Courts</TabsTrigger>
          {/* Schedule and Bookings tabs removed as per request */}
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          {/* Venue Images */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Venue Images</CardTitle>
                <div>
                  <label className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 cursor-pointer">
                    <ImageIcon className="h-4 w-4 mr-1" />
                    Upload Image
                    <Input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
                      {isEditing && (
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete image"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2">No images uploaded yet</p>
                </div>
              )}
              {isUploading && (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mr-2"></div>
                  <span>Uploading image...</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Venue Information */}
          <Card>
            <CardHeader>
              <CardTitle>Venue Information</CardTitle>
              <CardDescription>
                Manage your venue details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VenueLocationMapDialog
                open={isMapOpen}
                initialLat={editingVenue?.latitude ?? null}
                initialLng={editingVenue?.longitude ?? null}
                onClose={() => setIsMapOpen(false)}
                onConfirm={(lat, lng) => {
                  setEditingVenue(prev => ({ ...prev!, latitude: lat, longitude: lng }));
                  setIsMapOpen(false);
                }}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium">Address</p>
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input 
                            value={editingVenue?.address || ''} 
                            onChange={(e) => setEditingVenue(prev => ({
                              ...prev!,
                              address: e.target.value
                            }))}
                            className="mt-1"
                          />
                          <div className="space-y-2">
                            {isLoadingCities ? (
                              <Skeleton className="h-10 w-full" />
                            ) : (
                              <Select
                                value={editingVenue?.cityId || ''}
                                onValueChange={(value) => {
                                  const selectedCity = cities.find(city => city.CityID === value);
                                  setEditingVenue(prev => ({
                                    ...prev!,
                                    cityId: value,
                                    cityName: selectedCity?.CityName || ''
                                  }));
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select a city" />
                                </SelectTrigger>
                                <SelectContent>
                                  {cities.map((city) => (
                                    <SelectItem key={city.CityID} value={city.CityID}>
                                      {city.CityName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-muted-foreground">{address}</p>
                          {cityName && (
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">City:</span>
                              <span className="font-medium">{cityName}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium">Phone</p>
                      {isEditing ? (
                        <Input 
                          value={editingVenue?.phoneNumber || ''}
                          onChange={(e) => setEditingVenue(prev => ({
                            ...prev!,
                            phoneNumber: e.target.value
                          }))}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-muted-foreground">{phoneNumber}</p>
                      )}
                    </div>
                  </div>

                  {/* Latitude/Longitude fields and Map Picker */}
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium">Location (Latitude / Longitude)</p>
                      {isEditing ? (
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            type="number"
                            step="any"
                            value={editingVenue?.latitude ?? ''}
                            onChange={e => setEditingVenue(prev => ({
                              ...prev!,
                              latitude: e.target.value ? parseFloat(e.target.value) : null
                            }))}
                            placeholder="Latitude"
                            className="w-36"
                          />
                          <Input
                            type="number"
                            step="any"
                            value={editingVenue?.longitude ?? ''}
                            onChange={e => setEditingVenue(prev => ({
                              ...prev!,
                              longitude: e.target.value ? parseFloat(e.target.value) : null
                            }))}
                            placeholder="Longitude"
                            className="w-36"
                          />
                          <Button type="button" variant="outline" size="sm" onClick={() => setIsMapOpen(true)}>
                            Select on Map
                          </Button>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          {editingVenue?.latitude && editingVenue?.longitude ? `${editingVenue.latitude}, ${editingVenue.longitude}` : 'Not set'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium">Email</p>
                      {isEditing ? (
                        <Input 
                          type="email"
                          value={editingVenue?.email || ''}
                          onChange={(e) => setEditingVenue(prev => ({
                            ...prev!,
                            email: e.target.value
                          }))}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-muted-foreground">{email}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium">Opening Hours</p>
                      {isEditing ? (
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <div>
                            <Label htmlFor="openingTime" className="text-xs text-muted-foreground">
                              Opens at
                            </Label>
                            <Input
                              id="openingTime"
                              type="time"
                              value={editingVenue?.openingTime || ''}
                              onChange={(e) => setEditingVenue(prev => ({
                                ...prev!,
                                openingTime: e.target.value
                              }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="closingTime" className="text-xs text-muted-foreground">
                              Closes at
                            </Label>
                            <Input
                              id="closingTime"
                              type="time"
                              value={editingVenue?.closingTime || ''}
                              onChange={(e) => setEditingVenue(prev => ({
                                ...prev!,
                                closingTime: e.target.value
                              }))}
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          {openingTime} - {closingTime}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Status</p>
                        {isEditing ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              {editingVenue?.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <Switch
                              checked={editingVenue?.isActive}
                              onCheckedChange={(checked) => setEditingVenue(prev => ({
                                ...prev!,
                                isActive: checked
                              }))}
                            />
                          </div>
                        ) : (
                          <Badge variant={isActive ? "default" : "secondary"}>
                            {isActive ? "Active" : "Inactive"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium">Description</p>
                      {isEditing ? (
                        <Textarea
                          value={editingVenue?.desc || ''}
                          onChange={(e) => setEditingVenue(prev => ({
                            ...prev!,
                            desc: e.target.value
                          }))}
                          className="mt-1 min-h-[100px]"
                          placeholder="Add a description for your venue..."
                        />
                      ) : description ? (
                        <p className="text-muted-foreground">{description}</p>
                      ) : (
                        <p className="text-muted-foreground italic">No description provided</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setEditingVenue(venueData);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={async () => {
                      if (editingVenue) {
                        const success = await handleUpdateVenue(editingVenue);
                        if (success) {
                          setIsEditing(false);
                        }
                      }
                    }}
                    disabled={isUploading}
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courts" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Courts</CardTitle>
                  <CardDescription>
                    Manage the courts available at {venueName || 'your venue'}
                  </CardDescription>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => setIsAddCourtDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Court
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingCourts ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : isCourtsError ? (
                <div className="text-center py-8">
                  <p className="text-red-600 mb-4">Error loading courts. Please try again.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => refetchCourts()}
                    disabled={isLoadingCourts}
                  >
                    Retry
                  </Button>
                </div>
              ) : courts.length === 0 ? (
                <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
                  <div className="flex flex-col items-center justify-center">
                    <Users className="h-12 w-12 text-gray-400 mb-2" />
                    <h3 className="text-lg font-medium">No courts found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Get started by adding your first court
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => setIsAddCourtDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Court
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {courts.map((court: any) => (
                    <Card key={court.courtId} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-video bg-muted/50 relative">
                        {court.courtImage?.[0] ? (
                          <img 
                            src={court.courtImage[0]} 
                            alt={court.courtName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <Users className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${court.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {court.isActive ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-lg">{court.courtName}</h3>
                          <div className="flex items-center space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => setEditingCourt(court)}
                              title="Edit court"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="mt-2 space-y-1 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <span className="w-24">Category:</span>
                            <span className="font-medium">{court.courtCategory || 'N/A'}</span>
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <span className="w-24">Type:</span>
                            <span className="font-medium">{court.courtType || 'N/A'}</span>
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <span className="w-24">Rate:</span>
                            <span className="font-medium">Rs {court.hourlyRate?.toLocaleString() || '0'}/hour</span>
                          </div>
                        </div>

                        {court.desc && (
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
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
        </TabsContent>

        {/* Schedule and Bookings tabs content removed as per request */}
      </Tabs>

      {/* Add Court Dialog */}
      <AddCourtDialog 
        open={isAddCourtDialogOpen}
        onOpenChange={setIsAddCourtDialogOpen}
        venueId={venueData?.venueId || ''}
        onSuccess={() => refetchCourts()}
      />

      {/* Edit Court Dialog */}
      <EditCourtDialog 
        open={!!editingCourt}
        onOpenChange={(open) => !open && setEditingCourt(null)}
        court={editingCourt}
        venueId={venueData?.venueId || ''}
        onSuccess={() => {
          refetchCourts();
          setEditingCourt(null);
        }}
      />
    </div>
  );
}

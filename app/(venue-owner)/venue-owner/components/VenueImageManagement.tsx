"use client";

import React, { useState } from "react";
import {
  useGetVenueImagesQuery,
  useUploadVenueImageMutation,
  useDeleteVenueImageMutation,
} from "@/redux/api/venue-owner/venueApi";
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
import { ImagePlus, Trash2 } from "lucide-react";

interface VenueImageManagementProps {
  venueId: string;
}

export default function VenueImageManagement({
  venueId,
}: VenueImageManagementProps) {
  const { toast } = useToast();
  const {
    data: images = [],
    isLoading,
    refetch,
  } = useGetVenueImagesQuery({ venueId });
  const [uploadImage] = useUploadVenueImageMutation();
  const [deleteImage] = useDeleteVenueImageMutation();

  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageDescription, setImageDescription] = useState("");

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      toast({
        title: "Error",
        description: "Please select an image to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("venueId", venueId);
      if (imageDescription) {
        formData.append("description", imageDescription);
      }

      await uploadImage(formData).unwrap();
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });

      // Reset form
      setSelectedImage(null);
      setImageDescription("");
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await deleteImage({ imageId }).unwrap();
        toast({
          title: "Success",
          description: "Image deleted successfully",
        });
        refetch();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete image",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Venue Images</CardTitle>
        <CardDescription>Manage images for your venue</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="venueImage">Upload New Image</Label>
              <div className="flex gap-4">
                <Input
                  id="venueImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="flex-1"
                />
                <Button
                  onClick={handleUpload}
                  disabled={!selectedImage || isUploading}>
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageDescription">
                Image Description (Optional)
              </Label>
              <Input
                id="imageDescription"
                value={imageDescription}
                onChange={(e) => setImageDescription(e.target.value)}
                placeholder="Add a description for this image"
              />
            </div>
          </div>

          {/* Image Gallery */}
          <div className="space-y-4">
            <h3 className="font-semibold">Image Gallery</h3>
            {isLoading ? (
              <div>Loading images...</div>
            ) : images.length === 0 ? (
              <div className="text-muted-foreground">
                No images uploaded yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image: any) => (
                  <div key={image.imageId} className="relative group">
                    <img
                      src={image.imageUrl}
                      alt={image.description || "Venue image"}
                      className="w-full h-48 object-cover rounded-md"
                    />
                    {image.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {image.description}
                      </p>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(image.imageId)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import {
  useGetVenueUserDetailsQuery,
  useUpdateVenueUserDetailsMutation,
  useUploadVenueProfileImageMutation,
} from "@/redux/api/venue-owner/profileApi";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthUser } from "@/hooks/useAuthUser";
import { User, Camera, Save, Loader2 } from "lucide-react";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  userName: string;
  phoneNumber: string;
}

export default function ProfileManagement() {
  const { toast } = useToast();
  const { user, userId } = useAuthUser();

  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    userName: "",
    phoneNumber: "",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Get user details using statusId from user data
  const {
    data: userDetails,
    isLoading,
    error,
    refetch,
  } = useGetVenueUserDetailsQuery(
    { statusId: userId || "" },
    { skip: !userId }
  );

  const [updateUserDetails] = useUpdateVenueUserDetailsMutation();
  const [uploadProfileImage] = useUploadVenueProfileImageMutation();

  // Update form data when user details are loaded
  useEffect(() => {
    if (userDetails) {
      setFormData({
        firstName: userDetails.firstName || "",
        lastName: userDetails.lastName || "",
        userName: userDetails.userName || "",
        phoneNumber: userDetails.phoneNumber || "",
      });
    }
  }, [userDetails]);

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleUpdateProfile = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID not found",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateUserDetails({
        userId,
        ...formData,
      }).unwrap();

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleUploadImage = async () => {
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
      formData.append("profileImage", selectedImage);

      await uploadProfileImage(formData).unwrap();
      toast({
        title: "Success",
        description: "Profile image uploaded successfully",
      });
      setSelectedImage(null);
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload profile image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Management</CardTitle>
          <CardDescription>Manage your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Management</CardTitle>
          <CardDescription>Manage your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600">
            Error loading profile. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Management</CardTitle>
        <CardDescription>Manage your profile information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Image Section */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={userDetails?.profileImage}
              alt={`${userDetails?.firstName} ${userDetails?.lastName}`}
            />
            <AvatarFallback>
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="max-w-xs"
              />
              <Button
                onClick={handleUploadImage}
                disabled={!selectedImage || isUploading}
                size="sm">
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
                Upload
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Upload a new profile picture
            </p>
          </div>
        </div>

        {/* Profile Information Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="userName">Username</Label>
            <Input
              id="userName"
              value={formData.userName}
              onChange={(e) => handleInputChange("userName", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={userDetails?.email || ""}
              disabled
              className="bg-muted"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Email cannot be changed
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  // Reset form data to original values
                  if (userDetails) {
                    setFormData({
                      firstName: userDetails.firstName || "",
                      lastName: userDetails.lastName || "",
                      userName: userDetails.userName || "",
                      phoneNumber: userDetails.phoneNumber || "",
                    });
                  }
                }}>
                Cancel
              </Button>
              <Button onClick={handleUpdateProfile}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import React, { useState } from "react";
import { useCreateVenueApplicationMutation } from "@/redux/api/venue-owner/venueApplicationsApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function VenueApplication() {
  const { toast } = useToast();
  const [createVenueApplication, { isLoading }] =
    useCreateVenueApplicationMutation();
  const [formData, setFormData] = useState({
    venueName: "",
    address: "",
    cityName: "",
    phoneNumber: "",
    email: "",
    description: "",
    facilities: "",
    documents: null as File | null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, documents: e.target.files![0] }));
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

      await createVenueApplication(formDataToSend).unwrap();
      toast({
        title: "Success",
        description: "Venue application submitted successfully",
      });
      // Reset form
      setFormData({
        venueName: "",
        address: "",
        cityName: "",
        phoneNumber: "",
        email: "",
        description: "",
        facilities: "",
        documents: null,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit venue application",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apply for Venue Registration</CardTitle>
        <CardDescription>
          Fill out the form below to register your venue. Our team will review
          your application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="venueName">Venue Name</Label>
              <Input
                id="venueName"
                name="venueName"
                value={formData.venueName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cityName">City</Label>
              <Input
                id="cityName"
                name="cityName"
                value={formData.cityName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Venue Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="facilities">Available Facilities</Label>
            <Textarea
              id="facilities"
              name="facilities"
              value={formData.facilities}
              onChange={handleInputChange}
              placeholder="List all available facilities (e.g., Parking, Changing Rooms, etc.)"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="documents">Supporting Documents</Label>
            <Input
              id="documents"
              name="documents"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              required
            />
            <p className="text-sm text-muted-foreground">
              Upload any relevant documents (licenses, permits, etc.)
            </p>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

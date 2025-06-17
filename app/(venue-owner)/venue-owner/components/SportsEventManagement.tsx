"use client";

import React, { useState } from "react";
import {
  useGetSportsEventsQuery,
  useCreateSportsEventMutation,
  useUpdateSportsEventMutation,
  useDeleteSportsEventMutation,
} from "@/redux/api/venue-owner/sportsEventsApi";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SportsEventManagementProps {
  venueId: string;
}

export default function SportsEventManagement({
  venueId,
}: SportsEventManagementProps) {
  const { toast } = useToast();
  const {
    data: events = [],
    isLoading,
    refetch,
  } = useGetSportsEventsQuery({ venueId });
  const [createEvent] = useCreateSportsEventMutation();
  const [updateEvent] = useUpdateSportsEventMutation();
  const [deleteEvent] = useDeleteSportsEventMutation();

  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [formData, setFormData] = useState({
    eventName: "",
    eventType: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    maxParticipants: "",
    registrationFee: "",
    description: "",
    eventImage: null as File | null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, eventImage: e.target.files![0] }));
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

      if (editingEvent) {
        await updateEvent({
          eventId: editingEvent.eventId,
          ...formDataToSend,
        }).unwrap();
        toast({
          title: "Success",
          description: "Event updated successfully",
        });
      } else {
        await createEvent(formDataToSend).unwrap();
        toast({
          title: "Success",
          description: "Event created successfully",
        });
      }

      setIsAddingEvent(false);
      setEditingEvent(null);
      setFormData({
        eventName: "",
        eventType: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        maxParticipants: "",
        registrationFee: "",
        description: "",
        eventImage: null,
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: editingEvent
          ? "Failed to update event"
          : "Failed to create event",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (eventId: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent({ eventId }).unwrap();
        toast({
          title: "Success",
          description: "Event deleted successfully",
        });
        refetch();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete event",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setFormData({
      eventName: event.eventName,
      eventType: event.eventType,
      startDate: event.startDate,
      endDate: event.endDate,
      startTime: event.startTime,
      endTime: event.endTime,
      maxParticipants: event.maxParticipants.toString(),
      registrationFee: event.registrationFee.toString(),
      description: event.description || "",
      eventImage: null,
    });
    setIsAddingEvent(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Sports Events</CardTitle>
            <CardDescription>
              Manage sports events for your venue
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddingEvent(true)}>
            Create New Event
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isAddingEvent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventName">Event Name</Label>
                <Input
                  id="eventName"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventType">Event Type</Label>
                <Select
                  value={formData.eventType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, eventType: value }))
                  }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tournament">Tournament</SelectItem>
                    <SelectItem value="league">League</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="exhibition">Exhibition Match</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Maximum Participants</Label>
                <Input
                  id="maxParticipants"
                  name="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationFee">Registration Fee (Rs.)</Label>
                <Input
                  id="registrationFee"
                  name="registrationFee"
                  type="number"
                  value={formData.registrationFee}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Event Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventImage">Event Image</Label>
              <Input
                id="eventImage"
                name="eventImage"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editingEvent ? "Update Event" : "Create Event"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddingEvent(false);
                  setEditingEvent(null);
                  setFormData({
                    eventName: "",
                    eventType: "",
                    startDate: "",
                    endDate: "",
                    startTime: "",
                    endTime: "",
                    maxParticipants: "",
                    registrationFee: "",
                    description: "",
                    eventImage: null,
                  });
                }}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {isLoading ? (
              <div>Loading events...</div>
            ) : events.length === 0 ? (
              <div className="text-muted-foreground">
                No events found for this venue.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map((event: any) => (
                  <Card key={event.eventId}>
                    <CardContent className="pt-6">
                      {event.eventImageUrl && (
                        <img
                          src={event.eventImageUrl}
                          alt={event.eventName}
                          className="w-full h-48 object-cover rounded-md mb-4"
                        />
                      )}
                      <h3 className="font-semibold text-lg">
                        {event.eventName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Type: {event.eventType}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Date: {new Date(event.startDate).toLocaleDateString()} -{" "}
                        {new Date(event.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Time: {event.startTime} - {event.endTime}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Max Participants: {event.maxParticipants}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Registration Fee: Rs.{event.registrationFee}
                      </p>
                      {event.description && (
                        <p className="text-sm mt-2">{event.description}</p>
                      )}
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(event)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(event.eventId)}>
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

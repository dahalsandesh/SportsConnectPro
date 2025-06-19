"use client";

import React, { useState } from "react";
import {
  useGetSportsEventsQuery,
  useCreateSportsEventMutation,
  useUpdateSportsEventMutation,
  useDeleteSportsEventMutation,
} from "@/redux/api/venue-owner/eventApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SportsEventManagementProps {
  courtId: string;
}

export default function SportsEventManagement({
  courtId,
}: SportsEventManagementProps) {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SportsEvent | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    maxSeat: "",
  });

  const {
    data: events,
    isLoading,
    error,
  } = useGetSportsEventsQuery({
    courtId,
  });
  const [createEvent] = useCreateSportsEventMutation();
  const [updateEvent] = useUpdateSportsEventMutation();
  const [deleteEvent] = useDeleteSportsEventMutation();

  const handleCreateEvent = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("courtId", courtId);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("time", formData.time);
      formDataToSend.append("maxSeat", formData.maxSeat);

      await createEvent(formDataToSend).unwrap();
      toast({
        title: "Success",
        description: "Event created successfully",
      });
      setIsCreateDialogOpen(false);
      setFormData({ title: "", date: "", time: "", maxSeat: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    }
  };

  const handleUpdateEvent = async () => {
    if (!selectedEvent) return;
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("eventId", selectedEvent.eventId);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("time", formData.time);
      formDataToSend.append("maxSeat", formData.maxSeat);

      await updateEvent(formDataToSend).unwrap();
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
      setIsUpdateDialogOpen(false);
      setSelectedEvent(null);
      setFormData({ title: "", date: "", time: "", maxSeat: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent({ eventId }).unwrap();
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading events</div>;

  return (
    <>
      <div className="flex justify-end mb-6">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Event</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maxSeat" className="text-right">
                  Max Seats
                </Label>
                <Input
                  id="maxSeat"
                  type="number"
                  value={formData.maxSeat}
                  onChange={(e) =>
                    setFormData({ ...formData, maxSeat: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleCreateEvent}>Create</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events?.map((event) => (
          <Card key={event.eventId}>
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription>
                Date: {event.date} | Time: {event.time}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Max Seats: {event.maxSeat}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedEvent(event);
                  setFormData({
                    title: event.title,
                    date: event.date,
                    time: event.time,
                    maxSeat: event.maxSeat.toString(),
                  });
                  setIsUpdateDialogOpen(true);
                }}>
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteEvent(event.eventId)}>
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="update-title" className="text-right">
                Title
              </Label>
              <Input
                id="update-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="update-date" className="text-right">
                Date
              </Label>
              <Input
                id="update-date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="update-time" className="text-right">
                Time
              </Label>
              <Input
                id="update-time"
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="update-maxSeat" className="text-right">
                Max Seats
              </Label>
              <Input
                id="update-maxSeat"
                type="number"
                value={formData.maxSeat}
                onChange={(e) =>
                  setFormData({ ...formData, maxSeat: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleUpdateEvent}>Update</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

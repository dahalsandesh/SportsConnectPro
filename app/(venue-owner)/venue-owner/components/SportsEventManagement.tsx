"use client";

import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, Users, MapPin, Edit2, Trash2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useGetSportsEventsQuery,
  useCreateSportsEventMutation,
  useUpdateSportsEventMutation,
  useDeleteSportsEventMutation,
} from "@/redux/api/venue-owner/eventApi";
import { SportsEvent } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Form validation schema
const eventFormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  description: z.string().optional(),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  startTime: z.string().min(1, { message: "Start time is required" }),
  endTime: z.string().min(1, { message: "End time is required" }),
  maxSeat: z.string().min(1, { message: "Maximum seats is required" }),
  location: z.string().min(2, { message: "Location is required" }),
  isActive: z.boolean().default(true),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

interface SportsEventManagementProps {
  courtId: string;
  courtName?: string;
}

export default function SportsEventManagement({
  courtId,
  courtName = "this court",
}: SportsEventManagementProps) {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SportsEvent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date(),
      startTime: "10:00",
      endTime: "11:00",
      maxSeat: "20",
      location: "",
      isActive: true,
    },
  });

  // Fetch events for the current court
  const {
    data: events = [],
    isLoading,
    isError,
    error: fetchError,
    refetch,
  } = useGetSportsEventsQuery({ courtId });
  
  const [createEvent] = useCreateSportsEventMutation();
  const [updateEvent] = useUpdateSportsEventMutation();
  const [deleteEvent] = useDeleteSportsEventMutation();

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!isCreateDialogOpen) {
      form.reset();
    }
  }, [isCreateDialogOpen, form]);

  // Handle form submission for create/update
  const onSubmit = async (data: EventFormValues) => {
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      
      // Common fields
      formDataToSend.append("title", data.title);
      formDataToSend.append("description", data.description || "");
      formDataToSend.append("date", format(data.startDate, 'yyyy-MM-dd'));
      formDataToSend.append("startTime", data.startTime);
      formDataToSend.append("endTime", data.endTime);
      formDataToSend.append("maxSeat", data.maxSeat);
      formDataToSend.append("location", data.location);
      formDataToSend.append("isActive", data.isActive ? "1" : "0");

      if (selectedEvent) {
        // Update existing event
        formDataToSend.append("eventId", selectedEvent.eventId);
        await updateEvent(formDataToSend).unwrap();
        toast({
          title: "Success",
          description: "Event updated successfully",
        });
        setIsUpdateDialogOpen(false);
      } else {
        // Create new event
        formDataToSend.append("courtId", courtId);
        await createEvent(formDataToSend).unwrap();
        toast({
          title: "Success",
          description: "Event created successfully",
        });
        setIsCreateDialogOpen(false);
      }
      
      // Refresh events list
      refetch();
    } catch (error) {
      console.error("Error saving event:", error);
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to save event",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete event
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    
    try {
      await deleteEvent({ eventId: selectedEvent.eventId }).unwrap();
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setSelectedEvent(null);
      refetch();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  // Open edit dialog with event data
  const handleEditEvent = (event: SportsEvent) => {
    setSelectedEvent(event);
    form.reset({
      title: event.title,
      description: event.description || "",
      startDate: new Date(event.startDateTime),
      startTime: format(new Date(event.startDateTime), 'HH:mm'),
      endTime: format(new Date(event.endDateTime), 'HH:mm'),
      maxSeat: event.maxSeat.toString(),
      location: event.location || "",
      isActive: event.isActive,
    });
    setIsUpdateDialogOpen(true);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (event: SportsEvent) => {
    setSelectedEvent(event);
    setIsDeleteDialogOpen(true);
  };

  // Format date and time for display
  const formatEventDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return {
        date: format(date, 'MMM d, yyyy'),
        time: format(date, 'h:mm a'),
        fullDate: format(date, 'EEEE, MMMM d, yyyy'),
      };
    } catch (error) {
      console.error("Error formatting date:", error);
      return { date: "Invalid date", time: "", fullDate: "Invalid date" };
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-9 w-16" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {fetchError?.data?.message || "Failed to load events. Please try again later."}
        </AlertDescription>
      </Alert>
    );
  }

  // Main render
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Events</h2>
          <p className="text-muted-foreground">
            Manage events for {courtName}
          </p>
        </div>
        <Button 
          onClick={() => {
            setSelectedEvent(null);
            setIsCreateDialogOpen(true);
          }}
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Event
        </Button>
      </div>

      {events.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-12 pb-16 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-1">No events yet</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Get started by creating your first event
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create Event
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const { date, time, fullDate } = formatEventDateTime(event.startDateTime);
            const endTime = format(new Date(event.endDateTime), 'h:mm a');
            
            return (
              <Card key={event.eventId} className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="relative h-32 bg-muted">
                  {event.imageUrl && (
                    <img 
                      src={event.imageUrl} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-semibold text-lg line-clamp-1">{event.title}</h3>
                    <div className="flex items-center text-sm text-white/90">
                      <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                      {date}
                    </div>
                  </div>
                  <Badge 
                    variant={event.isActive ? "default" : "secondary"} 
                    className="absolute top-2 right-2"
                  >
                    {event.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-muted-foreground">Time</p>
                        <p className="font-medium">{time} - {endTime}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-muted-foreground">Seats</p>
                        <p className="font-medium">{event.availableSeats || 0} / {event.maxSeat} available</p>
                      </div>
                    </div>
                    {event.location && (
                      <div className="col-span-2 flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-muted-foreground">Location</p>
                          <p className="font-medium line-clamp-2">{event.location}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {event.description && (
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {event.description}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-4 pt-0 border-t flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditEvent(event)}
                    className="flex-1"
                  >
                    <Edit2 className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeleteClick(event)}
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Event Dialog */}
      <Dialog
        open={isCreateDialogOpen || isUpdateDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setIsUpdateDialogOpen(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <ScrollArea className="max-h-[60vh] pr-4 -mr-4">
                <div className="space-y-4 pb-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter event title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter event description (optional)" 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxSeat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Seats</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter event location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            {field.value 
                              ? "This event is visible to users"
                              : "This event is hidden from users"}
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </ScrollArea>
              
              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setIsUpdateDialogOpen(false);
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {selectedEvent ? 'Updating...' : 'Creating...'}
                    </>
                  ) : selectedEvent ? (
                    'Update Event'
                  ) : (
                    'Create Event'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Are you sure you want to delete "{selectedEvent?.title}"? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteEvent}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Event'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

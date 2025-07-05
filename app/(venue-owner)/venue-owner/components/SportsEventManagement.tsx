"use client";

import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon, Clock, Users, MapPin, Edit2, Trash2, Plus, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useGetSportsEventsQuery,
  useCreateSportsEventMutation,
  useUpdateSportsEventMutation,
  useDeleteSportsEventMutation,
} from "@/redux/api/venue-owner/eventApi";
// Using local SportsEvent interface to avoid conflicts
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
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Form schema using zod
const eventFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.date({
    required_error: "Date is required",
  }),
  time: z.string().min(1, "Time is required"),
  maxSeat: z.string().min(1, "Maximum seats is required"),
  isActive: z.boolean().default(true),
  image: z.any().optional(),
});

interface EventFormValues {
  title: string;
  description?: string;
  date: Date;
  time: string;
  maxSeat: string;
  isActive: boolean;
}

// Alias for the API SportsEvent type to avoid conflicts
interface ApiSportsEvent {
  eventId: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  eventImage?: string;
  [key: string]: any; // Allow additional properties
};

// Use the API type but extend it with our required fields
interface SportsEvent extends ApiSportsEvent {
  startDateTime: string;
  endDateTime: string;
  maxSeat: number;
  location: string;
  isActive: boolean;
  availableSeats?: number;
}

interface SportsEventManagementProps {
  courtId: string;
  courtName?: string;
}

export default function SportsEventManagement({
  courtId,
  courtName = "this court",
}: SportsEventManagementProps) {
  const { toast } = useToast();
  type EventFormValues = z.infer<typeof eventFormSchema>;
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SportsEvent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Initialize form with default values
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema) as any, // Type assertion to handle form types
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date(),
      startTime: "10:00",
      endTime: "11:00",
      maxSeat: "20",
      location: "",
      isActive: true,
      image: undefined,
    },
    mode: "onChange"
  });

  const { control, handleSubmit, reset, watch, setValue } = form;
  const imageInput = watch("image");

  // Fetch events for the current court with proper typing
  const {
    data: eventsData,
    isLoading,
    isError,
    error: fetchError,
    refetch,
  } = useGetSportsEventsQuery({ courtId });
  
  // Transform API events to our extended SportsEvent format
  const events = React.useMemo<SportsEvent[]>(() => {
    if (!eventsData || !Array.isArray(eventsData)) return [];
    
    return eventsData.map((event: any) => ({
      ...event,
      // Map API fields to our extended interface
      startDateTime: event.date ? `${event.date}T${event.time || '00:00:00'}` : new Date().toISOString(),
      endDateTime: event.date ? `${event.date}T${event.time || '23:59:59'}` : new Date().toISOString(),
      maxSeat: event.maxSeat || 0,
      location: event.location || '',
      isActive: event.isActive !== undefined ? event.isActive : true,
    }));
  }, [eventsData]);
  
  const [createEvent] = useCreateSportsEventMutation();
  const [updateEvent] = useUpdateSportsEventMutation();
  const [deleteEvent] = useDeleteSportsEventMutation();

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!isCreateDialogOpen) {
      form.reset();
    }
  }, [isCreateDialogOpen, form]);

  // Validate time slots
  const validateTimeSlots = (startTime: string, endTime: string): boolean => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startDate = new Date();
    startDate.setHours(startHour, startMinute);
    
    const endDate = new Date();
    endDate.setHours(endHour, endMinute);
    
    return endDate > startDate;
  };

  // Handle form submission for create/update
  const onSubmit: SubmitHandler<EventFormValues> = async (data) => {
    try {
      setIsSubmitting(true);
      setFormError(null);
      
      const formData = new FormData();
      
      // Format date and time for API
      const eventDate = new Date(data.date);
      const [hours, minutes] = data.time.split(':').map(Number);
      eventDate.setHours(hours, minutes);
      
      // Append event data in the format expected by the API
      formData.append('title', data.title);
      formData.append('description', data.description || '');
      formData.append('date', format(eventDate, 'yyyy-MM-dd'));
      formData.append('time', format(eventDate, 'HH:mm:ss')); // Ensure seconds are included
      formData.append('maxSeat', data.maxSeat);
      formData.append('isActive', data.isActive ? '1' : '0');
      
      // If there's an image, append it with the correct field name 'image'
      if (data.image?.[0]) {
        formData.append('image', data.image[0]);
      }
      
      // Append court ID
      formData.append('courtId', courtId);
      
      try {
        // If we're updating, include the event ID
        if (selectedEvent) {
          formData.append('eventId', selectedEvent.eventId);
          await updateEvent(formData).unwrap();
          toast({
            title: 'Success',
            description: 'Event updated successfully',
            variant: 'default',
          });
        } else {
          await createEvent(formData).unwrap();
          toast({
            title: 'Success',
            description: 'Event created successfully',
            variant: 'default',
          });
        }
        
        // Close dialog and reset form
        setIsCreateDialogOpen(false);
        setIsUpdateDialogOpen(false);
        reset();
        
        // Refresh events list
        refetch();
      } catch (error: unknown) {
        console.error('API Error:', error);
        let errorMessage = 'Failed to save event';
        
        if (error && typeof error === 'object' && 'data' in error) {
          const errorData = error.data as { message?: string };
          errorMessage = errorData?.message || errorMessage;
        } else if (error instanceof Error) {
          errorMessage = error.message || errorMessage;
        }
        
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Error in form submission:', error);
      const errorMessage = error?.message || 'An unexpected error occurred';
      setFormError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
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
        title: 'Success',
        description: 'Event deleted successfully',
        variant: 'default',
      });
      setIsDeleteDialogOpen(false);
      setSelectedEvent(null);
      refetch();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete event',
        variant: 'destructive',
      });
    }
  };

  // Open edit dialog with event data
  const handleEditEvent = (event: SportsEvent) => {
    setSelectedEvent(event);
    setFormError(null);
    
    // Parse the date and time from the API response
    const eventDate = event.date ? new Date(event.date) : new Date();
    const eventTime = event.time || '10:00';
    
    reset({
      title: event.title || "",
      description: event.description || "",
      date: isNaN(eventDate.getTime()) ? new Date() : eventDate,
      time: eventTime.split(':').slice(0, 2).join(':'), // Ensure we only keep HH:mm format
      maxSeat: event.maxSeat?.toString() || "20",
      isActive: event.isActive !== undefined ? event.isActive : true,
      image: undefined, // Reset image to avoid stale data
    });
    
    setIsCreateDialogOpen(false);
    setIsUpdateDialogOpen(true);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (event: SportsEvent) => {
    setSelectedEvent(event);
    setIsDeleteDialogOpen(true);
  };

  // Format date and time for display with additional logging and robust error handling
  const formatEventDateTime = (dateTimeString?: string | null) => {
    const defaultReturn = { 
      date: "No date", 
      time: "", 
      fullDate: "No date",
      raw: dateTimeString || ""
    };
    
    if (!dateTimeString) return defaultReturn;
    
    try {
      // Handle both ISO strings and date objects
      const date = typeof dateTimeString === 'string' 
        ? new Date(dateTimeString) 
        : dateTimeString;
        
      if (!(date instanceof Date) || isNaN(date.getTime())) {
        console.error('Invalid date value:', dateTimeString);
        return { ...defaultReturn, date: "Invalid date", fullDate: "Invalid date" };
      }
      
      return {
        date: format(date, "MMM d, yyyy"),
        time: format(date, "h:mm a"),
        fullDate: format(date, "EEEE, MMMM d, yyyy 'at' h:mm a"),
        raw: dateTimeString
      };
    } catch (error) {
      console.error('Error formatting date:', error, 'Input:', dateTimeString);
      return { ...defaultReturn, date: "Date error", fullDate: "Date error" };
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
          {fetchError && 'data' in fetchError ? (fetchError as { data: { message?: string } }).data?.message : "Failed to load events. Please try again later."}
        </AlertDescription>
      </Alert>
    );
  }

  // Main render
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Court: {courtName}</h2>
          <p className="text-muted-foreground">
            Manage events and schedules
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
            className="w-1/2 sm:w-auto"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
          <Button 
            onClick={() => {
              setSelectedEvent(null);
              form.reset();
              setIsCreateDialogOpen(true);
            }}
            className="w-1/2 sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Event
          </Button>
        </div>
      </div>

      {events.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-12 pb-16 text-center">
            <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
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
            const formattedDate = format(new Date(event.date), 'MMM d, yyyy');
            const formattedTime = event.time ? format(new Date(`2000-01-01T${event.time}`), 'h:mm a') : 'No time';
            
            return (
              <Card key={event.eventId} className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="relative h-32 bg-muted">
                  {event.image && (
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to a placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-semibold text-lg line-clamp-1 text-white">{event.title}</h3>
                    <div className="flex items-center text-sm text-white/90">
                      <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                      {formattedDate}
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
                        <p className="font-medium">{formattedTime}</p>
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
            form.reset();
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{selectedEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                <ScrollArea className="h-[60vh] w-full">
                  <div className="space-y-4 p-4">
                    {formError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{formError}</AlertDescription>
                      </Alert>
                    )}
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
                        name="date"
                        render={({ field }) => {
                          // Ensure we have a valid date
                          const dateValue = field.value ? new Date(field.value) : new Date();
                          
                          return (
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
                                      type="button"
                                    >
                                      {field.value ? (
                                        format(dateValue, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <CalendarComponent
                                    mode="single"
                                    selected={dateValue}
                                    onSelect={(date) => field.onChange(date || new Date())}
                                    disabled={(date) => {
                                      // Disable past dates
                                      const today = new Date();
                                      today.setHours(0, 0, 0, 0);
                                      return date < today;
                                    }}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />

                      <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type="time" 
                                  {...field}
                                />
                              </div>
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
                              <div className="relative">
                                <Input 
                                  type="number" 
                                  min="1" 
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === '' || (Number(value) > 0 && Number(value) <= 1000)) {
                                      field.onChange(value);
                                    }
                                  }}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

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

                    {/* Image Upload */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="image" className="text-right">
                        Event Image
                      </Label>
                      <div className="col-span-3 space-y-2">
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          className="cursor-pointer"
                          onChange={(e) => {
                            setValue("image", e.target.files);
                          }}
                        />
                        {imageInput?.[0] && (
                          <div className="mt-2">
                            <p className="text-sm text-muted-foreground">
                              {imageInput[0].name}
                            </p>
                            {imageInput[0].type.startsWith('image/') && (
                              <img
                                src={URL.createObjectURL(imageInput[0])}
                                alt="Preview"
                                className="mt-2 h-32 w-32 rounded-md object-cover"
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
              <DialogFooter className="flex-shrink-0 pt-4 border-t mt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setIsUpdateDialogOpen(false);
                    form.reset();
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
                  ) : selectedEvent ? 'Update Event' : 'Create Event'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="sticky top-0 bg-background z-10 pb-4 border-b">
            <DialogTitle>Delete Event</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto px-6 py-2">
            <p className="text-muted-foreground">
              Are you sure you want to delete "{selectedEvent?.title}"? This action cannot be undone.
            </p>
          </div>
          <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
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

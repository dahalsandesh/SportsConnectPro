"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useCreateCourtMutation } from "@/redux/api/venue-owner/courtApi";
import { useGetVenueDetailsQuery } from "@/redux/api/venue-owner/venueApi";
import { useGetSportCategoriesQuery } from "@/redux/api/venue-owner/sportCategoryApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus } from "lucide-react";

const formSchema = z.object({
  courtName: z.string().min(2, {
    message: "Court name must be at least 2 characters.",
  }),
  courtCategoryId: z.string().min(1, {
    message: "Please select a sport category.",
  }),
  hourlyRate: z.string().min(1, {
    message: "Please enter an hourly rate.",
  }),
  capacity: z.string().min(1, {
    message: "Please enter the court capacity.",
  }),
  surfaceType: z.string().min(1, {
    message: "Please select a surface type.",
  }),
  desc: z.string().optional(),
});

interface AddCourtDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venueId: string;
  onSuccess?: () => void;
}

const surfaceTypes = [
  { value: "Artificial Grass", label: "Artificial Grass" },
  { value: "Wood", label: "Wood" },
  { value: "Concrete", label: "Concrete" },
];

export function AddCourtDialog({ open, onOpenChange, venueId, onSuccess }: AddCourtDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: venueData } = useGetVenueDetailsQuery(undefined, {
    skip: !venueId,
  });
  
  const { data: sportCategories = [] } = useGetSportCategoriesQuery();
  const [createCourt] = useCreateCourtMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courtName: "",
      courtCategoryId: "",
      hourlyRate: "",
      capacity: "",
      surfaceType: "",
      desc: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!venueId) {
      toast({
        title: "Error",
        description: "Venue ID is missing. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const courtData = {
        ...values,
        venueId,
      };

      await createCourt(courtData).unwrap();
      
      toast({
        title: "Success",
        description: "Court added successfully!",
      });
      
      form.reset();
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error creating court:", error);
      toast({
        title: "Error",
        description: "Failed to add court. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Court</DialogTitle>
          <DialogDescription>
            Add a new court to {venueData?.venueName || 'your venue'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto pr-2 max-h-[calc(90vh-200px)]">
            <FormField
              control={form.control}
              name="courtName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Court Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Court 1, Main Court" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="courtCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sport Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a sport category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sportCategories.map((category: any) => (
                        <SelectItem key={category.sportCategoryId} value={category.sportCategoryId}>
                          {category.sportCategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hourly Rate (NPR)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 1500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="surfaceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Surface Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select surface type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {surfaceTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add a description for this court..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4 border-t sticky bottom-0 bg-background">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Court
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

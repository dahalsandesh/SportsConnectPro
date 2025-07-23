"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateCourtMutation, useUploadCourtImageMutation } from "@/redux/api/venue-owner/courtApi";
import { useGetSportCategoriesQuery, SportCategory } from "@/redux/api/venue-owner/sportCategoryApi";
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
import { Loader2, Image as ImageIcon, X } from "lucide-react";
import { Court } from "@/types/api";
import { Switch } from "@/components/ui/switch";
import { FormDescription } from "@/components/ui/form";

const formSchema = z.object({
  courtName: z.string().min(2, {
    message: "Court name must be at least 2 characters.",
  }),
  courtCategoryId: z.string().min(1, {
    message: "Please select a sport category.",
  }),
  surfaceType: z.string().min(1, {
    message: "Please select a surface type.",
  }),
  hourlyRate: z.string().min(1, {
    message: "Please enter an hourly rate.",
  }),
  capacity: z.string().min(1, {
    message: "Please enter the court capacity.",
  }),
  desc: z.string().optional(),
  isActive: z.string().optional(),
});

interface EditCourtDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  court: any | null;
  venueId: string;
  onSuccess?: () => void;
}

const surfaceTypes = [
  { value: "Artificial Grass", label: "Artificial Grass" },
  { value: "Wood", label: "Wood" },
  { value: "Concrete", label: "Concrete" },
];

export function EditCourtDialog({ open, onOpenChange, court, venueId, onSuccess }: EditCourtDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const { data: sportCategoriesResponse, isLoading: isLoadingCategories } = useGetSportCategoriesQuery(undefined, {
    refetchOnMountOrArgChange: true
  });
  
  const sportCategories = sportCategoriesResponse || [];
  
  // Debug log
  useEffect(() => {
    console.log('Sport Categories:', sportCategories);
    console.log('Is Loading Categories:', isLoadingCategories);
  }, [sportCategories, isLoadingCategories]);
  const [updateCourt] = useUpdateCourtMutation();
  const [uploadImage] = useUploadCourtImageMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courtName: "",
      courtCategoryId: "",
      surfaceType: "",
      hourlyRate: "",
      capacity: "0",
      desc: "",
      isActive: "1",
    },
  });

  // Use a ref to track previous court data
  const prevCourtRef = useRef(court);

  // Set form values when court data is available
  useEffect(() => {
    if (!court) return;
    
    // Only update if court data has actually changed
    if (prevCourtRef.current === court) return;
    
    // Update the ref
    prevCourtRef.current = court;

    // Find the category ID by name if we only have the name
    let categoryId = "";
    if (court.courtCategory && !court.courtCategoryId) {
      const foundCategory = sportCategories.find(
        (cat: SportCategory) => cat.sportCategory === court.courtCategory
      );
      if (foundCategory) {
        categoryId = foundCategory.sportCategoryId;
      }
    } else {
      categoryId = court.courtCategoryId || "";
    }

    // Reset form with new values
    form.reset({
      courtName: court.courtName || "",
      courtCategoryId: categoryId,
      surfaceType: court.surfaceType || court.courtType || "", // Fallback to courtType for backward compatibility
      hourlyRate: court.hourlyRate?.toString() || "",
      capacity: court.capacity?.toString() || "0",
      desc: court.desc || "",
      isActive: court.isActive?.toString() || "1",
    });

    // Set image preview if available
    if (court.courtImage?.[0] && imagePreview !== court.courtImage[0]) {
      setImagePreview(court.courtImage[0]);
    } else if (!court.courtImage?.[0] && imagePreview !== null) {
      setImagePreview(null);
    }
    
    // Only depend on court and sportCategories
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [court, sportCategories]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!court?.courtId) return;
    
    try {
      setIsSubmitting(true);
      
      // Find the selected category
      const selectedCategory = sportCategories.find(
        (cat: SportCategory) => cat.sportCategoryId === values.courtCategoryId
      );
      
      // Prepare court data
      const courtData = {
        courtId: court.courtId,
        courtName: values.courtName,
        courtCategory: selectedCategory?.sportCategoryName || "",
        courtCategoryId: values.courtCategoryId,
        surfaceType: values.surfaceType, // Changed from courtType to surfaceType
        hourlyRate: values.hourlyRate,
        capacity: values.capacity,
        desc: values.desc,
        isActive: values.isActive,
      };

      await updateCourt(courtData).unwrap();
      
      // Upload new image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('courtId', court.courtId);
        formData.append('image', imageFile);
        
        await uploadImage(formData).unwrap();
      }
      
      toast({
        title: "Success",
        description: "Court updated successfully!",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating court:", error);
      toast({
        title: "Error",
        description: "Failed to update court. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Court</DialogTitle>
          <DialogDescription>
            Update the court details below
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">

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
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={isLoadingCategories}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a sport category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingCategories ? (
                          <div className="p-2 text-center text-sm text-muted-foreground">
                            Loading categories...
                          </div>
                        ) : sportCategories.length > 0 ? (
                          sportCategories.map((category: SportCategory) => (
                            <SelectItem 
                              key={category.sportCategoryId} 
                              value={category.sportCategoryId}
                            >
                              {category.sportCategory}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-center text-sm text-muted-foreground">
                            No categories found
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        <SelectItem value="Artificial Grass">Artificial Grass</SelectItem>
                        <SelectItem value="Wood">Wood</SelectItem>
                        <SelectItem value="Concrete">Concrete</SelectItem>
                        <SelectItem value="Grass">Natural Grass</SelectItem>
                        <SelectItem value="Clay">Clay</SelectItem>
                        <SelectItem value="Hard">Hard Court</SelectItem>
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
              
              <div className="space-y-2">
                <FormLabel>Court Image</FormLabel>
                <div className="flex items-center gap-4">
                  <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-6 h-6 mb-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        {imagePreview ? 'Change' : 'Upload'} Image
                      </p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  {imagePreview && (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Court preview" 
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Court Status
                      </FormLabel>
                      <FormDescription>
                        Toggle to activate or deactivate this court
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value === "1"}
                        onCheckedChange={(checked) => {
                          field.onChange(checked ? "1" : "0");
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter className="gap-2 sm:gap-0">
              <div className="flex items-center justify-end w-full space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

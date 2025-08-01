"use client";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateVenuePostMutation } from "@/redux/api/venue-owner/postApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  categoryId: z.string().min(1, {
    message: "Please select a category.",
  }),
});

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Array<{ sportCategoryId: string; sportCategory: string }>;
}

export function CreatePostDialog({
  open,
  onOpenChange,
  categories,
}: CreatePostDialogProps) {
  const { toast } = useToast();
  const [createPost, { isLoading }] = useCreateVenuePostMutation();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const { user } = useAuth();
  const [createVenuePost] = useCreateVenuePostMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user?.userId) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      // Append text fields
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('categoryId', values.categoryId);
      formData.append('userId', user.userId); // Add userId to form data
      
      // Append image if selected
      if (selectedImage) {
        formData.append('postImage', selectedImage, selectedImage.name);
      }

      // Log form data for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('Submitting form data:');
        for (let [key, value] of formData.entries()) {
          console.log(key, value instanceof File ? `${value.name} (${value.size} bytes)` : value);
        }
      }

      // Call the venue post creation mutation with formData
      const response = await createVenuePost(formData).unwrap();
      
      // Check if the response indicates success
      if (!response.success) {
        throw new Error(response.message || 'Failed to create post');
      }
      
      // Reset form and state on success
      form.reset({
        title: "",
        description: "",
        categoryId: ""
      });
      setSelectedImage(null);
      setImagePreview(null);
      
      // Show success message
      toast({
        title: "Success",
        description: "Post created successfully!",
      });
      
      // Close the dialog
      onOpenChange(false);
      
    } catch (error) {
      console.error('Error creating post:', error);
      
      // Show error message
      const errorMessage = error?.data?.message || 
                         error?.message || 
                         "Failed to create post. Please try again.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            Create a new post or news article for your platform.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter post title" {...field} />
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
                      placeholder="Enter post description"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.sportCategoryId}
                          value={category.sportCategoryId}>
                          {category.sportCategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Post Image</label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative">
                    <Avatar className="h-20 w-20 rounded-md">
                      <AvatarImage
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                      />
                      <AvatarFallback className="rounded-md">
                        IMG
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={removeImage}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-20 h-20 border-2 border-dashed border-muted-foreground/25 rounded-md">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload an image for your post (optional)
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Post
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

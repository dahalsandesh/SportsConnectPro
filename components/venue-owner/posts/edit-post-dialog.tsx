"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useUpdateVenuePostMutation } from "@/redux/api/venue-owner/postApi";
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
import { Loader2, Upload, X, ImageIcon } from "lucide-react";
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

interface EditPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: {
    postID: string;
    title: string;
    description: string;
    category: string;
    postImage?: string;
  };
  categories: Array<{ sportCategoryId: string; sportCategory: string }>;
  onSuccess: () => void;
}

export function EditPostDialog({
  open,
  onOpenChange,
  post,
  categories,
  onSuccess,
}: EditPostDialogProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(post.postImage || null);
  const [isLoading, setIsLoading] = useState(false);

  // Find the category ID based on the category name
  const findCategoryId = (categoryName: string) => {
    const category = categories.find(cat => cat.sportCategory === categoryName);
    return category ? category.sportCategoryId : '';
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post.title,
      description: post.description,
      categoryId: findCategoryId(post.category),
    },
  });
  
  // Reset form when post changes
  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        description: post.description,
        categoryId: findCategoryId(post.category),
      });
      setImagePreview(post.postImage || null);
    }
  }, [post]);

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

  const [updateVenuePost, { isLoading: isUpdating }] = useUpdateVenuePostMutation();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user?.userId) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      
      // Append text fields with proper encoding
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("categoryId", values.categoryId);
      formData.append("postId", post.postID); // Add postId to the form data

      // Append file if it exists
      if (selectedImage) {
        formData.append("postImage", selectedImage);
      }

      // Log form data for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('Updating post with data:');
        for (let [key, value] of formData.entries()) {
          console.log(key, value instanceof File ? `${value.name} (${value.size} bytes)` : value);
        }
      }

      // Call the update venue post mutation
      const response = await updateVenuePost(formData).unwrap();
      
      // Reset form and state on success
      setSelectedImage(null);
      onOpenChange(false);
      onSuccess();
      
      toast({
        title: "Post updated",
        description: "The post has been updated successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>
            Update the post details below.
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
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.sportCategoryId}
                          value={category.sportCategoryId}
                        >
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
              <FormLabel>Featured Image</FormLabel>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative">
                    <Avatar className="h-24 w-24 rounded-md">
                      <AvatarImage
                        src={imagePreview}
                        alt="Post preview"
                        className="object-cover"
                      />
                      <AvatarFallback className="rounded-md">
                        <ImageIcon className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white hover:bg-destructive/90"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-md border border-dashed">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <label
                    htmlFor="post-image"
                    className="inline-flex items-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {imagePreview ? 'Change' : 'Upload'} Image
                    <input
                      id="post-image"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    JPG, PNG up to 2MB
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Post
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

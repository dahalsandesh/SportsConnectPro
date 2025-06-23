"use client";

import React, { useState, useEffect } from "react";
import { useCreateAdminReelMutation, useUpdateAdminReelMutation, useGetAdminReelDetailsQuery } from "@/redux/api/admin/reelsApi";
import { useGetSportCategoriesQuery } from "@/redux/api/venue-owner/sportCategoryApi";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface CreateEditReelDialogProps {
  open: boolean;
  onClose: () => void;
  reelId?: string;
}

const CreateEditReelDialog: React.FC<CreateEditReelDialogProps> = ({ open, onClose, reelId }) => {
  const isEdit = Boolean(reelId);
  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    video: undefined as File | undefined,
  });
  
  // Fetch sport categories and ensure we have data before rendering
  const { data: sportCategoriesData = [], isLoading: isLoadingCategories } = useGetSportCategoriesQuery();
  const sportCategories = Array.isArray(sportCategoriesData) ? sportCategoriesData : [];
  const { userId } = useAuthUser();
  const [createReel, { isLoading: isCreating }] = useCreateAdminReelMutation();
  const [updateReel, { isLoading: isUpdating }] = useUpdateAdminReelMutation();
  const { data: reelDetails } = useGetAdminReelDetailsQuery(reelId!, { 
    skip: !isEdit,
    // Add a callback to log the response
    onSuccess: (data) => {
      console.log('Reel details from API:', data);
    },
    onError: (error) => {
      console.error('Error fetching reel details:', error);
    }
  });
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isEdit && reelDetails) {
      console.log('Reel details:', reelDetails); // Debug log
      // Find the category by name if we have the category name but not the ID
      const categoryFromName = reelDetails.category 
        ? sportCategories.find(cat => cat.sportCategory === reelDetails.category)?.sportCategoryId 
        : null;
      
      setForm({
        title: reelDetails.title || "",
        description: reelDetails.description || "",
        categoryId: reelDetails.categoryId || reelDetails.sportCategoryId || categoryFromName || "",
        video: undefined,
      });
    }
  }, [isEdit, reelDetails, sportCategories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setForm({ ...form, video: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!form.categoryId) {
      setError("Please select a sport category");
      return;
    }
    
    if (!userId) {
      setError("User not authenticated");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("categoryId", form.categoryId);
    formData.append("userId", userId);
    if (form.video) formData.append("video", form.video);
    if (isEdit && reelId) formData.append("reelId", reelId || reelDetails?.postID);

    try {
      if (isEdit) {
        await updateReel(formData).unwrap();
      } else {
        await createReel(formData).unwrap();
      }
      onClose();
    } catch (err: any) {
      setError(err?.data?.message || "Failed to save reel");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>{isEdit ? "Edit Reel" : "Create Reel"}</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input name="title" value={form.title} onChange={handleChange} className="input w-full" required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="input w-full" required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Sport Category</label>
            {isLoadingCategories ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2">Loading categories...</span>
              </div>
            ) : (
              <Select
                value={form.categoryId}
                onValueChange={(value) => setForm({...form, categoryId: value})}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a sport category" />
                </SelectTrigger>
                <SelectContent>
                  {sportCategories.map((category) => (
                    <SelectItem 
                      key={category.sportCategoryId} 
                      value={category.sportCategoryId}
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {category.sportCategory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">Video</label>
            <input type="file" accept="video/*" onChange={handleFileChange} className="input w-full" />
            {isEdit && (reelDetails?.postImage || reelDetails?.video) && (
              <video 
                src={reelDetails.postImage || reelDetails.video} 
                controls 
                className="w-32 h-20 mt-2 object-cover" 
              />
            )}
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <DialogFooter>
            <Button type="button" onClick={onClose} variant="outline">Cancel</Button>
            <Button type="submit" disabled={isCreating || isUpdating} variant="primary">
              {isEdit ? (isUpdating ? "Updating..." : "Update") : (isCreating ? "Creating..." : "Create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditReelDialog;

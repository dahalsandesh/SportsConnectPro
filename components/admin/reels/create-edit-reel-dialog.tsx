"use client";

import React, { useState } from "react";
import { useCreateAdminReelMutation, useUpdateAdminReelMutation, useGetAdminReelDetailsQuery } from "@/redux/api/admin/reelsApi";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogActions } from "@/components/ui/dialog";

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
  const [createReel, { isLoading: isCreating }] = useCreateAdminReelMutation();
  const [updateReel, { isLoading: isUpdating }] = useUpdateAdminReelMutation();
  const { data: reelDetails } = useGetAdminReelDetailsQuery(reelId!, { skip: !isEdit });
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isEdit && reelDetails) {
      setForm({
        title: reelDetails.title || "",
        description: reelDetails.description || "",
        categoryId: reelDetails.categoryId || "",
        video: undefined,
      });
    }
  }, [isEdit, reelDetails]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setForm({ ...form, video: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("categoryId", form.categoryId);
    if (form.video) formData.append("video", form.video);
    if (isEdit && reelId) formData.append("reelId", reelId);

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
            <label className="block mb-1 font-medium">Category ID</label>
            <input name="categoryId" value={form.categoryId} onChange={handleChange} className="input w-full" required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Video</label>
            <input type="file" accept="video/*" onChange={handleFileChange} className="input w-full" />
            {isEdit && reelDetails?.postImage && (
              <video src={reelDetails.postImage} controls className="w-32 h-20 mt-2 object-cover" />
            )}
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <DialogActions>
            <Button type="button" onClick={onClose} variant="outline">Cancel</Button>
            <Button type="submit" disabled={isCreating || isUpdating} variant="primary">
              {isEdit ? (isUpdating ? "Updating..." : "Update") : (isCreating ? "Creating..." : "Create")}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditReelDialog;

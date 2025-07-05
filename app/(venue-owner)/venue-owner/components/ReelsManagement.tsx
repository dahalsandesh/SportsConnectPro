import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Video, Edit, Trash2, Play } from "lucide-react";
import {
  useGetReelsQuery,
  useCreateReelMutation,
  useUpdateReelMutation,
  useDeleteReelMutation,
} from "@/redux/api/venue-owner/reelApi";
import { toast } from "sonner";

const ReelsManagement = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingReel, setEditingReel] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  // Fetch reels
  console.log('ReelsManagement: Component mounted, fetching reels...');
  const { data: reels = [], isLoading, isError, refetch } = useGetReelsQuery(undefined, {
    // Add refetchOnMountOrArgChange to ensure it refetches when mounted
    refetchOnMountOrArgChange: true,
  });
  
  console.log('Reels data:', { reels, isLoading, isError });
  const [createReel, { isLoading: isCreatingReel }] = useCreateReelMutation();
  const [updateReel, { isLoading: isUpdating }] = useUpdateReelMutation();
  const [deleteReel] = useDeleteReelMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile) {
      toast.error("Please select a video file");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoFile", videoFile);
    if (thumbnailFile) formData.append("thumbnailFile", thumbnailFile);

    try {
      if (editingReel) {
        formData.append("reelId", editingReel.reelId);
        await updateReel(formData).unwrap();
        toast.success("Reel updated successfully");
      } else {
        await createReel(formData).unwrap();
        toast.success("Reel created successfully");
      }
      resetForm();
      refetch();
    } catch (error) {
      console.error("Error saving reel:", error);
      toast.error("Failed to save reel");
    }
  };

  const handleEdit = (reel: any) => {
    setEditingReel(reel);
    setTitle(reel.title);
    setDescription(reel.description || "");
    setIsCreating(true);
  };

  const handleDelete = async (reelId: string) => {
    if (window.confirm("Are you sure you want to delete this reel?")) {
      try {
        await deleteReel({ reelId }).unwrap();
        toast.success("Reel deleted successfully");
        refetch();
      } catch (error) {
        console.error("Error deleting reel:", error);
        toast.error("Failed to delete reel");
      }
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setVideoFile(null);
    setThumbnailFile(null);
    setEditingReel(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Reels</h2>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Reel
        </Button>
      </div>

      {(isCreating || editingReel) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingReel ? 'Edit Reel' : 'Add New Reel'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter reel title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter reel description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="video">Video File {!editingReel && '(required)'}</Label>
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  required={!editingReel}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail Image (optional)</Label>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={isCreatingReel || isUpdating}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreatingReel || isUpdating}>
                  {editingReel ? 'Update' : 'Create'} Reel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div>Loading reels...</div>
      ) : isError ? (
        <div>Error loading reels</div>
      ) : reels.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Video className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No reels yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get started by creating your first reel
            </p>
            <Button 
              onClick={() => setIsCreating(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> Create Reel
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reels.map((reel: any) => (
            <Card key={reel.reelId} className="overflow-hidden">
              <div className="relative aspect-video bg-muted">
                {reel.thumbnailUrl ? (
                  <img
                    src={reel.thumbnailUrl}
                    alt={reel.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted">
                    <Video className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <a
                    href={reel.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/90 hover:bg-white text-black rounded-full p-3"
                  >
                    <Play className="h-6 w-6" />
                  </a>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium line-clamp-1">{reel.title}</h3>
                {reel.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {reel.description}
                  </p>
                )}
                <div className="flex justify-end mt-4 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(reel)}
                  >
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(reel.reelId)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReelsManagement;

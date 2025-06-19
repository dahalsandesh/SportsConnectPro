import React, { useState } from "react";
import {
  useGetVenuePostsQuery,
  useCreateVenuePostMutation,
  useGetVenuePostDetailsQuery,
  useUpdateVenuePostMutation,
  useDeleteVenuePostMutation,
} from "@/redux/api/venue-owner/postApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Image, Video, FileText, Edit, Trash2 } from "lucide-react";

interface VenuePostFormProps {
  initialData?: any;
  onSubmit: (form: FormData) => void;
  loading: boolean;
  onCancel: () => void;
  type: "post" | "reel" | "news";
}

const VenuePostForm: React.FC<VenuePostFormProps> = ({
  initialData,
  onSubmit,
  loading,
  onCancel,
  type,
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("categoryId", categoryId);
    formData.append("type", type);
    if (mediaFile) formData.append("mediaFile", mediaFile);
    if (initialData?.postId) formData.append("postId", initialData.postId);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="media">
          {type === "post" ? "Image" : type === "reel" ? "Video" : "Media"}
        </Label>
        <Input
          id="media"
          type="file"
          accept={type === "reel" ? "video/*" : "image/*"}
          onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
          required={!initialData}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {initialData ? "Update" : "Create"}{" "}
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

const VenueNewsMedia: React.FC = () => {
  const { data: posts, isLoading, error, refetch } = useGetVenuePostsQuery();
  const [createVenuePost, { isLoading: isCreating }] =
    useCreateVenuePostMutation();
  const [updateVenuePost, { isLoading: isUpdating }] =
    useUpdateVenuePostMutation();
  const [deleteVenuePost, { isLoading: isDeleting }] =
    useDeleteVenuePostMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"post" | "reel" | "news">("post");

  const handleCreate = async (form: FormData) => {
    await createVenuePost(form).unwrap();
    setShowForm(false);
    refetch();
  };

  const handleUpdate = async (form: FormData) => {
    await updateVenuePost(form).unwrap();
    setShowForm(false);
    setEditingPost(null);
    refetch();
  };

  const handleDelete = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      await deleteVenuePost({ postId }).unwrap();
      refetch();
    }
  };

  const renderContent = () => {
    if (showForm) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingPost ? "Edit" : "Create"}{" "}
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <VenuePostForm
              initialData={editingPost}
              onSubmit={editingPost ? handleUpdate : handleCreate}
              loading={isCreating || isUpdating}
              onCancel={() => {
                setShowForm(false);
                setEditingPost(null);
              }}
              type={activeTab}
            />
          </CardContent>
        </Card>
      );
    }

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading content.</div>;
    if (!posts || posts.length === 0) return <div>No content found.</div>;

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: any) => (
          <Card key={post.postId}>
            <CardContent className="p-4">
              {post.mediaUrl && (
                <div className="aspect-video mb-4 overflow-hidden rounded-lg">
                  {post.type === "reel" ? (
                    <video
                      src={post.mediaUrl}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={post.mediaUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              )}
              <h3 className="font-semibold mb-2">{post.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {post.description}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingPost(post);
                    setShowForm(true);
                  }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(post.postId)}
                  disabled={isDeleting}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Venue News & Media</h2>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        )}
      </div>

      <Tabs
        defaultValue="post"
        onValueChange={(value) =>
          setActiveTab(value as "post" | "reel" | "news")
        }>
        <TabsList>
          <TabsTrigger value="post">
            <Image className="h-4 w-4 mr-2" />
            Posts
          </TabsTrigger>
         
          <TabsTrigger value="news">
            <FileText className="h-4 w-4 mr-2" />
            News
          </TabsTrigger>
          <TabsTrigger value="reel">
            <Video className="h-4 w-4 mr-2" />
            Reels
          </TabsTrigger>
        </TabsList>
        <TabsContent value="post">{renderContent()}</TabsContent>
        <TabsContent value="reel">{renderContent()}</TabsContent>
        <TabsContent value="news">{renderContent()}</TabsContent>
      </Tabs>
    </div>
  );
};

export default VenueNewsMedia;

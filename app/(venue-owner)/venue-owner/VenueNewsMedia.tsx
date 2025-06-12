import React, { useState } from "react";
import {
  useGetVenuePostsQuery,
  useCreateVenuePostMutation,
  useGetVenuePostDetailsQuery,
  useUpdateVenuePostMutation,
  useDeleteVenuePostMutation,
} from "@/redux/api/venueManagementApi";

interface VenuePostFormProps {
  initialData?: any;
  onSubmit: (form: FormData) => void;
  loading: boolean;
  onCancel: () => void;
}

const VenuePostForm: React.FC<VenuePostFormProps> = ({ initialData, onSubmit, loading, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
  const [postImage, setPostImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("categoryId", categoryId);
    if (postImage) formData.append("postImage", postImage);
    if (initialData?.postId) formData.append("postId", initialData.postId);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Category ID"
        value={categoryId}
        onChange={e => setCategoryId(e.target.value)}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={e => setPostImage(e.target.files?.[0] || null)}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit" disabled={loading}>{initialData ? "Update" : "Create"} Post</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

const VenueNewsMedia: React.FC = () => {
  const { data: posts, isLoading, error, refetch } = useGetVenuePostsQuery();
  const [createVenuePost, { isLoading: isCreating }] = useCreateVenuePostMutation();
  const [updateVenuePost, { isLoading: isUpdating }] = useUpdateVenuePostMutation();
  const [deleteVenuePost, { isLoading: isDeleting }] = useDeleteVenuePostMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);

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
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deleteVenuePost({ postId }).unwrap();
      refetch();
    }
  };

  return (
    <div>
      <h2>Venue News & Media</h2>
      {showForm && (
        <VenuePostForm
          initialData={editingPost}
          onSubmit={editingPost ? handleUpdate : handleCreate}
          loading={isCreating || isUpdating}
          onCancel={() => { setShowForm(false); setEditingPost(null); }}
        />
      )}
      {!showForm && (
        <button onClick={() => setShowForm(true)}>Create New Post</button>
      )}
      {isLoading ? (
        <p>Loading posts...</p>
      ) : error ? (
        <p>Error loading posts.</p>
      ) : posts && posts.length > 0 ? (
        <table style={{ width: "100%", marginTop: 24 }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Category</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post: any) => (
              <tr key={post.postId}>
                <td>{post.title}</td>
                <td>{post.description}</td>
                <td>{post.categoryId}</td>
                <td>
                  {post.postImageUrl ? (
                    <img src={post.postImageUrl} alt="Post" style={{ width: 64, height: 64, objectFit: "cover" }} />
                  ) : "-"}
                </td>
                <td>
                  <button onClick={() => { setEditingPost(post); setShowForm(true); }}>Edit</button>
                  <button onClick={() => handleDelete(post.postId)} disabled={isDeleting}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
};

export default VenueNewsMedia;

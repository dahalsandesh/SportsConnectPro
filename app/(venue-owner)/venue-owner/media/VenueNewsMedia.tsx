"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Image as ImageIcon, Video, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function VenueNewsMedia() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (type: "image" | "video" | "document") => {
    try {
      setIsUploading(true);
      // TODO: Implement file upload logic
      toast({
        title: "Coming soon",
        description: "File upload functionality will be available soon.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Media Library</h1>
          <p className="text-muted-foreground">
            Manage your venue's media content
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleUpload("image")} disabled={isUploading}>
            <ImageIcon className="mr-2 h-4 w-4" />
            Upload Image
          </Button>
          <Button
            onClick={() => handleUpload("video")}
            disabled={isUploading}
            variant="outline">
            <Video className="mr-2 h-4 w-4" />
            Upload Video
          </Button>
          <Button
            onClick={() => handleUpload("document")}
            disabled={isUploading}
            variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg">
              <Button variant="ghost" onClick={() => handleUpload("image")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Images
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg">
              <Button variant="ghost" onClick={() => handleUpload("video")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Videos
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg">
              <Button variant="ghost" onClick={() => handleUpload("document")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Documents
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

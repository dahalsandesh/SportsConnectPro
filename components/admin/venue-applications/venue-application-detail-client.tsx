"use client";

import { useState } from "react";
import { useGetVenueApplicationByIdQuery } from "@/redux/api/admin/venueApplicationsApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { CheckCircle, X, FileText, Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface VenueApplicationDetailClientProps {
  id: string;
}

export default function VenueApplicationDetailClient({
  id,
}: VenueApplicationDetailClientProps) {
  const { toast } = useToast();
  const {
    data: application,
    error,
    isLoading,
  } = useGetVenueApplicationByIdQuery(id);
  const [adminRemark, setAdminRemark] = useState("");
  const [activeTab, setActiveTab] = useState("details");

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  if (error || !application) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load venue application details. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleApprove = () => {
    toast({
      title: "Application Approved",
      description: "The venue application has been approved successfully.",
    });
  };

  const handleReject = () => {
    toast({
      title: "Application Rejected",
      description: "The venue application has been rejected successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{application.VenueName}</CardTitle>
                <CardDescription>
                  Application submitted on{" "}
                  {format(new Date(application.CreatedAt), "MMMM dd, yyyy")}
                </CardDescription>
              </div>
              <div>{getStatusBadge(application.Status)}</div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Venue Information
                    </h3>
                    <Separator className="my-2" />
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="font-medium">Name:</dt>
                        <dd>{application.VenueName}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Address:</dt>
                        <dd>{application.Address}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Phone:</dt>
                        <dd>{application.PhoneNumber}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Email:</dt>
                        <dd>{application.Email}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">PAN Number:</dt>
                        <dd>{application.PanNumber}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Application Status
                    </h3>
                    <Separator className="my-2" />
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="font-medium">Status:</dt>
                        <dd>{getStatusBadge(application.Status)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Submitted On:</dt>
                        <dd>
                          {format(
                            new Date(application.CreatedAt),
                            "MMMM dd, yyyy"
                          )}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Reviewed On:</dt>
                        <dd>
                          {application.reviewed_at
                            ? format(
                                new Date(application.reviewed_at),
                                "MMMM dd, yyyy"
                              )
                            : "Not reviewed yet"}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Admin Remark:</dt>
                        <dd>{application.AdminRemark || "No remarks"}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>

              {application.Status === "pending" && (
                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Review Application
                  </h3>
                  <Separator className="my-2" />
                  <div className="space-y-2">
                    <Label htmlFor="remark">Admin Remark</Label>
                    <Textarea
                      id="remark"
                      placeholder="Enter your remarks here..."
                      value={adminRemark}
                      onChange={(e) => setAdminRemark(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
            {application.Status === "pending" && (
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleReject}>
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button onClick={handleApprove}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Submitted Documents</CardTitle>
              <CardDescription>
                Review the documents submitted with this application
              </CardDescription>
            </CardHeader>
            <CardContent>
              {application.document && application.document.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {application.document.map((doc, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          {doc.docType}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center">
                          <FileText className="h-8 w-8 text-muted-foreground mr-2" />
                          <span className="text-sm truncate">
                            {doc.file.split("/").pop()}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="w-full">
                          <a
                            href={doc.file}
                            target="_blank"
                            rel="noopener noreferrer">
                            <Download className="mr-2 h-4 w-4" />
                            View Document
                          </a>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p>No documents submitted with this application.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

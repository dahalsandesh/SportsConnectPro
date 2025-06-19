"use client";

import { useState } from "react";
import {
  useGetAllVenueApplicationsQuery,
  useUpdateVenueApplicationStatusMutation,
} from "@/redux/api/admin/venueApplicationsApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ApplicationDetailDialog } from "./application-detail-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusColors = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  "Under Review":
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const statusIcons = {
  pending: Clock,
  "Under Review": Eye,
  Approved: CheckCircle,
  Rejected: XCircle,
};

export function ApplicationsManagement() {
  const {
    data: applications,
    isLoading,
    isError,
  } = useGetAllVenueApplicationsQuery();
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateVenueApplicationStatusMutation();
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const { toast } = useToast();

  const handleViewDetails = (application: any) => {
    setSelectedApplication(application);
    setIsDetailDialogOpen(true);
  };

  const handleStatusChange = async (
    applicationId: string,
    newStatus: string
  ) => {
    try {
      await updateStatus({ applicationId, status: newStatus }).unwrap();
      toast({
        title: "Status updated",
        description: `Application status has been updated to ${newStatus}.`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-destructive">
          Error loading applications. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Venue Applications
          </CardTitle>
          <p className="text-muted-foreground">
            Review and manage venue registration applications
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Venue Name</TableHead>
                  <TableHead>Applicant Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Actions</TableHead>
                  <TableHead>Update Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications && applications.length > 0 ? (
                  applications.map((application) => {
                    const StatusIcon =
                      statusIcons[
                        application.Status as keyof typeof statusIcons
                      ] || Clock;
                    return (
                      <TableRow
                        key={application.ID}
                        className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {application.VenueName}
                        </TableCell>
                        <TableCell>{application.Email}</TableCell>
                        <TableCell>{application.PhoneNumber}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              statusColors[
                                application.Status as keyof typeof statusColors
                              ]
                            }>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {application.Status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(application.CreatedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(application)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={application.Status}
                            onValueChange={(value) =>
                              handleStatusChange(application.ID, value)
                            }
                            disabled={isUpdating}>
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="Under Review">
                                Under Review
                              </SelectItem>
                              <SelectItem value="Approved">Approved</SelectItem>
                              <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Clock className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          No applications found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Application Detail Dialog */}
      {selectedApplication && (
        <ApplicationDetailDialog
          open={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
          applicationId={selectedApplication.ID}
        />
      )}
    </div>
  );
}

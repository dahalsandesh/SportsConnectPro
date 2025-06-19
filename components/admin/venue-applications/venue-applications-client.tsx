"use client";

import { useState } from "react";
import { useGetAllVenueApplicationsQuery } from "@/redux/api/admin/venueApplicationsApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ApplicationsTable } from "./applications-table";
import { Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function VenueApplicationsClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: applications,
    error,
    isLoading,
  } = useGetAllVenueApplicationsQuery();

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load venue applications. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <Tabs defaultValue="all-applications" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all-applications">All Applications</TabsTrigger>
            <TabsTrigger value="pending-applications">Pending</TabsTrigger>
            <TabsTrigger value="approved-applications">Approved</TabsTrigger>
            <TabsTrigger value="rejected-applications">Rejected</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search applications..."
                className="w-64 pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <TabsContent value="all-applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Applications</CardTitle>
              <CardDescription>Manage all venue applications</CardDescription>
            </CardHeader>
            <CardContent>
              <ApplicationsTable
                applications={applications || []}
                isLoading={isLoading}
                searchQuery={searchQuery}
                filter="all"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending-applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Applications</CardTitle>
              <CardDescription>
                Manage pending venue applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApplicationsTable
                applications={applications || []}
                isLoading={isLoading}
                searchQuery={searchQuery}
                filter="pending"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved-applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approved Applications</CardTitle>
              <CardDescription>
                Manage approved venue applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApplicationsTable
                applications={applications || []}
                isLoading={isLoading}
                searchQuery={searchQuery}
                filter="approved"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected-applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Applications</CardTitle>
              <CardDescription>
                Manage rejected venue applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApplicationsTable
                applications={applications || []}
                isLoading={isLoading}
                searchQuery={searchQuery}
                filter="rejected"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

"use client";

import { useState } from "react";
import { useGetVenuesQuery } from "@/redux/api/admin/venueApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VenuesTable } from "./venues-table";
import { PlusCircle, Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CreateVenueDialog } from "./create-venue-dialog";

export default function VenuesClient() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: venues, error, isLoading } = useGetVenuesQuery();

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load venues. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <Tabs defaultValue="all-venues" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all-venues">All Venues</TabsTrigger>
            <TabsTrigger value="active-venues">Active Venues</TabsTrigger>
            <TabsTrigger value="inactive-venues">Inactive Venues</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search venues..."
                className="w-64 pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Venue
            </Button>
          </div>
        </div>

        <TabsContent value="all-venues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Venues</CardTitle>
              <CardDescription>
                Manage all venues of the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VenuesTable
                venues={venues || []}
                isLoading={isLoading}
                searchQuery={searchQuery}
                filter="all"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active-venues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Venues</CardTitle>
              <CardDescription>
                Manage active venues of the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VenuesTable
                venues={venues || []}
                isLoading={isLoading}
                searchQuery={searchQuery}
                filter="active"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive-venues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inactive Venues</CardTitle>
              <CardDescription>
                Manage inactive venues of the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VenuesTable
                venues={venues || []}
                isLoading={isLoading}
                searchQuery={searchQuery}
                filter="inactive"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateVenueDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </>
  );
}

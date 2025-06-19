"use client";

import { useState } from "react";
import { useGetUserTypesQuery } from "@/redux/api/admin/userTypesApi";
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
import { UsersTable } from "./users-table";
import { UserTypeTable } from "./user-type-table";
import { PlusCircle, Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CreateUserTypeDialog } from "./create-user-type-dialog";

export default function UsersClient() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: userTypes, error, isLoading } = useGetUserTypesQuery();

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load user types. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <Tabs defaultValue="user-types" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            {/* <TabsTrigger value="all-users">All Users</TabsTrigger>
            <TabsTrigger value="normal-users">Normal Users</TabsTrigger>
            <TabsTrigger value="venue-owners">Venue Owners</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger> */}
            <TabsTrigger value="user-types">User Types</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="w-64 pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>

        <TabsContent value="all-users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                Manage all users of the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UsersTable userType="all" searchQuery={searchQuery} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="normal-users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Normal Users</CardTitle>
              <CardDescription>
                Manage normal users of the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UsersTable userType="NormalUsers" searchQuery={searchQuery} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="venue-owners" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Venue Owners</CardTitle>
              <CardDescription>
                Manage venue owners of the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UsersTable userType="VenueOwner" searchQuery={searchQuery} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admins</CardTitle>
              <CardDescription>
                Manage admin users of the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UsersTable userType="Admin" searchQuery={searchQuery} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user-types" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Types</CardTitle>
                <CardDescription>
                  Manage user types of the platform
                </CardDescription>
              </div>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add User Type
              </Button>
            </CardHeader>
            <CardContent>
              <UserTypeTable
                userTypes={userTypes || []}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateUserTypeDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </>
  );
}

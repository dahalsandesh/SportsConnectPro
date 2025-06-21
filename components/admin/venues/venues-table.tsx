"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit,
  Trash,
  Eye,
  Ban,
  CheckCircle,
} from "lucide-react";
import { useUpdateVenueStatusMutation } from "@/redux/api/admin/venueApi";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Venue } from "@/types/api";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface VenuesTableProps {
  venues: Venue[];
  isLoading: boolean;
  searchQuery: string;
  filter: "all" | "active" | "inactive";
  onViewDetails: (venue: Venue) => void;
}

export function VenuesTable({
  venues,
  isLoading,
  searchQuery,
  filter,
  onViewDetails,
}: VenuesTableProps) {
  const { toast } = useToast();
  const [updateVenueStatus] = useUpdateVenueStatusMutation();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [newStatus, setNewStatus] = useState<boolean>(false);

  // Filter venues based on searchQuery and filter
  const filteredVenues = venues.filter((venue) => {
    // Filter by status
    if (filter === "active" && !venue.isActive) {
      return false;
    }
    if (filter === "inactive" && venue.isActive) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        venue.name.toLowerCase().includes(query) ||
        venue.address.toLowerCase().includes(query) ||
        venue.phoneNumber.includes(query) ||
        venue.city.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const handleStatusChange = async () => {
    if (!selectedVenue) return;

    try {
      await updateVenueStatus({
        venueId: selectedVenue.venueID,
        isActive: newStatus ? 1 : 0,
      }).unwrap();

      toast({
        title: "Venue status updated",
        description: `Venue "${selectedVenue.name}" has been ${
          newStatus ? "activated" : "deactivated"
        } successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update venue status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setStatusDialogOpen(false);
      setSelectedVenue(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-8" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVenues.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No venues found.
                </TableCell>
              </TableRow>
            ) : (
              filteredVenues.map((venue) => (
                <TableRow key={venue.venueID}>
                  <TableCell className="font-medium">
                    {venue.venueID.substring(0, 8)}...
                  </TableCell>
                  <TableCell>{venue.name}</TableCell>
                  <TableCell>
                    {venue.address}, {venue.city}
                  </TableCell>
                  <TableCell>{venue.phoneNumber}</TableCell>
                  <TableCell>
                    {venue.isActive ? (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        Active
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onViewDetails(venue)}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {venue.isActive ? (
                          <DropdownMenuItem
                            className="text-amber-600"
                            onClick={() => {
                              setSelectedVenue(venue);
                              setNewStatus(false);
                              setStatusDialogOpen(true);
                            }}>
                            <Ban className="mr-2 h-4 w-4" /> Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="text-green-600"
                            onClick={() => {
                              setSelectedVenue(venue);
                              setNewStatus(true);
                              setStatusDialogOpen(true);
                            }}>
                            <CheckCircle className="mr-2 h-4 w-4" /> Activate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will {newStatus ? "activate" : "deactivate"} the venue "
              {selectedVenue?.name}". This action can be undone later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusChange}>
              {newStatus ? "Activate" : "Deactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

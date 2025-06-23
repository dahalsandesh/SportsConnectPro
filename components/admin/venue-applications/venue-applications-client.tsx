"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Eye, Check, X, Loader2 } from "lucide-react";
import { useGetAllVenueApplicationsQuery, useUpdateVenueApplicationStatusMutation } from "@/redux/api/admin/venueApplicationsApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Under Review';

interface Application {
  ID: string;
  VenueName: string;
  Applicant_id: string;
  Address: string;
  City_id: string;
  PhoneNumber: string;
  Email: string;
  PanNumber: string;
  Status: ApplicationStatus;
  AdminRemark: string;
  IsActive: boolean;
  CreatedAt: string;
  reviewed_at?: string;
}

export default function VenueApplicationsClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  const { data, error, isLoading, refetch } = useGetAllVenueApplicationsQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateVenueApplicationStatusMutation();

  // Debug log the API response
  useEffect(() => {
  }, [data, error, isLoading]);

  // Process the API response
  const applications: Application[] = useMemo(() => {
    if (!data) return [];
    // Handle case where data is already an array
    if (Array.isArray(data)) return data;
    // Handle case where data is an object with a data property that's an array
    if (data && Array.isArray(data.data)) return data.data;
    return [];
  }, [data]);

  console.log('Processed applications:', applications);
  
  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const searchTerm = searchQuery.toLowerCase();
      const venueName = application.VenueName?.toLowerCase() || '';
      const email = application.Email?.toLowerCase() || '';
      const phoneNumber = application.PhoneNumber?.toString() || '';
      
      const matchesSearch = venueName.includes(searchTerm) || 
                          email.includes(searchTerm) ||
                          phoneNumber.includes(searchQuery);
      
      const matchesStatus = selectedStatus === 'all' || application.Status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchQuery, selectedStatus]);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateStatus({ 
        applicationId: id, 
        status: status as 'Approved' | 'Rejected' | 'Pending' | 'Under Review'
      }).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      Pending: { label: 'Pending', variant: 'bg-yellow-100 text-yellow-800' },
      'Under Review': { label: 'Under Review', variant: 'bg-blue-100 text-blue-800' },
      Approved: { label: 'Approved', variant: 'bg-green-100 text-green-800' },
      Rejected: { label: 'Rejected', variant: 'bg-red-100 text-red-800' },
    };
    const { label, variant } = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'bg-gray-100 text-gray-800' };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${variant}`}>{label}</span>;
  };

  if (error) {
    return (
      <div className="p-4 text-red-500 border rounded-md bg-red-50">
        Failed to load venue applications. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search applications..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant={selectedStatus === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedStatus('all')}
        >
          All
        </Button>
        <Button
          variant={selectedStatus === 'Pending' ? 'default' : 'outline'}
          onClick={() => setSelectedStatus('Pending')}
        >
          Pending
        </Button>
        <Button
          variant={selectedStatus === 'Under Review' ? 'default' : 'outline'}
          onClick={() => setSelectedStatus('Under Review')}
        >
          Under Review
        </Button>
        <Button
          variant={selectedStatus === 'Approved' ? 'default' : 'outline'}
          onClick={() => setSelectedStatus('Approved')}
        >
          Approved
        </Button>
        <Button
          variant={selectedStatus === 'Rejected' ? 'default' : 'outline'}
          onClick={() => setSelectedStatus('Rejected')}
        >
          Rejected
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Venue Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Loading applications...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No applications found
                </TableCell>
              </TableRow>
            ) : (
              filteredApplications.map((application) => (
                <TableRow key={application.ID}>
                  <TableCell className="font-medium">
                    <div>{application.VenueName}</div>
                    <div className="text-sm text-muted-foreground">{application.Email}</div>
                  </TableCell>
                  <TableCell>
                    <div>{application.PhoneNumber}</div>
                    <div className="text-sm text-muted-foreground">PAN: {application.PanNumber}</div>
                  </TableCell>
                  <TableCell>{application.Address}</TableCell>
                  <TableCell>{format(new Date(application.CreatedAt), 'PPp')}</TableCell>
                  <TableCell>{getStatusBadge(application.Status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/admin/venue-applications/${application.ID}`}>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Select
                        value={application.Status}
                        onValueChange={(value) => handleStatusUpdate(application.ID, value)}
                        disabled={isUpdating}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Update status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Under Review">Under Review</SelectItem>
                          <SelectItem value="Approved">Approved</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

"use client";

import { useGetAllEventsQuery } from "@/redux/api/admin/eventsApi";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const columns = [
  {
    accessorKey: "title",
    header: "Title",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "eventImage",
    header: "Image",
    cell: (info) =>
      info.getValue() ? (
        <img
          src={info.getValue()}
          alt="Event"
          className="h-10 w-10 object-cover rounded"
        />
      ) : null,
  },
  // Add actions column if needed
];

export default function AdminEventsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Events Management</h1>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p>Events management content will be displayed here.</p>
        <p className="text-red-500 mt-4">
          Note: The API endpoint for fetching all events is not available. This
          page is a placeholder.
        </p>
      </div>
    </div>
  );
}

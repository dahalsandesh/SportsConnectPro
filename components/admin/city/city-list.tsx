"use client";

import { useState } from "react";
import {
  useGetCitiesQuery,
  useDeleteCityMutation,
} from "@/redux/api/admin/citiesApi";
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
import { Trash, Edit, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { CityForm } from "./city-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

export function CityList() {
  const { data: cities = [], isLoading, isError, refetch } = useGetCitiesQuery();
  // DEBUG: Log cities data and loading/error state
  // Remove this after debugging
  // eslint-disable-next-line no-console
  console.log('CityList data:', { cities, isLoading, isError });
  const [deleteCity, { isLoading: isDeleting }] = useDeleteCityMutation();
  const [editingCity, setEditingCity] = useState<{
    cityId: string;
    cityName: string;
  } | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [cityToDelete, setCityToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const handleEdit = (city: { cityId: string; cityName: string }) => {
    setEditingCity(city);
    setIsEditDialogOpen(true);
  };

  const confirmDelete = (cityId: string) => {
    setCityToDelete(cityId);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!cityToDelete) return;

    try {
      await deleteCity({ cityId: cityToDelete }).unwrap();
      toast({
        title: "City deleted",
        description: "The city has been deleted successfully.",
        variant: "success",
      });
      setIsDeleteDialogOpen(false);
      setCityToDelete(null);
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the city. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Cities</CardTitle>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add City
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>City Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isError ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-destructive">
                  Error loading cities. Please try again.
                </TableCell>
              </TableRow>
            ) : Array.isArray(cities) && cities.length > 0 ? (
              cities.map((city) => (
                <TableRow key={city.cityId}>
                  <TableCell className="font-medium">{city.cityName}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(city)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmDelete(city.cityId)}
                        disabled={isDeleting}
                      >
                        {isDeleting && cityToDelete === city.cityId ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash className="h-4 w-4 text-destructive" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center">
                  No cities found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Add City Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New City</DialogTitle>
          </DialogHeader>
          <CityForm
            onSuccess={() => {
              setIsAddDialogOpen(false);
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit City Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit City</DialogTitle>
          </DialogHeader>
          {editingCity && (
            <CityForm
              initialData={editingCity}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                setEditingCity(null);
                refetch();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the city.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCityToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

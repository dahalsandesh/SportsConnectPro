"use client"

import { useState } from "react"
import { useGetCitiesQuery, useDeleteCityMutation } from "@/redux/api/cityApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash, Edit, Plus, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { CityForm } from "./city-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function CityList() {
  const { data: cities, isLoading, isError } = useGetCitiesQuery()
  const [deleteCity, { isLoading: isDeleting }] = useDeleteCityMutation()
  const [editingCity, setEditingCity] = useState<{ cityId: string; cityName: string } | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [cityToDelete, setCityToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  const handleEdit = (city: { cityId: string; cityName: string }) => {
    setEditingCity(city)
    setIsEditDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!cityToDelete) return

    try {
      await deleteCity({ cityId: cityToDelete }).unwrap()
      toast({
        title: "City deleted",
        description: "The city has been deleted successfully.",
        variant: "success",
      })
      setIsDeleteDialogOpen(false)
      setCityToDelete(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the city. Please try again.",
        variant: "destructive",
      })
    }
  }

  const confirmDelete = (cityId: string) => {
    setCityToDelete(cityId)
    setIsDeleteDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-destructive">Error loading cities. Please try again.</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Cities</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add City
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New City</DialogTitle>
            </DialogHeader>
            <CityForm onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>City Name</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cities && cities.length > 0 ? (
              cities.map((city) => (
                <TableRow key={city.cityId}>
                  <TableCell>{city.cityName}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(city)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => confirmDelete(city.cityId)}
                      disabled={isDeleting}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
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

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit City</DialogTitle>
            </DialogHeader>
            {editingCity && (
              <CityForm
                initialData={editingCity}
                onSuccess={() => {
                  setIsEditDialogOpen(false)
                  setEditingCity(null)
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
              <AlertDialogCancel onClick={() => setCityToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}

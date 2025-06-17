"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Venue } from '@/types/api';
import { 
  useGetVenuesQuery, 
  useUpdateVenueDetailsMutation, 
  useDeleteVenueImageMutation, 
  useUploadVenueImageMutation, 
  useGetVenueImagesQuery 
} from '@/redux/api/venue-owner/venueApi';
import { Plus, MapPin, Edit, Trash2, Image as ImageIcon } from 'lucide-react';

interface VenueFormData {
  venueId?: string;
  name: string;
  address: string;
  cityId: string;
  cityName: string;
  phoneNumber: string;
  email: string;
  desc?: string;
  isActive: boolean;
}

export default function VenueManagement() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Fetch venues for the current user
  const { 
    data: venuesResponse, 
    isLoading: isLoadingVenues, 
    isError,
    refetch 
  } = useGetVenuesQuery(
    { userId: user?.userName || '' }, // Using userName as ID since it's available in auth state
    { skip: !user?.userName }
  );

  const [venues, setVenues] = useState<Venue[]>([]);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize venues when data is loaded
  useEffect(() => {
    if (venuesResponse?.data) {
      setVenues(Array.isArray(venuesResponse.data) ? venuesResponse.data : []);
    }
  }, [venuesResponse]);

  const [updateVenue] = useUpdateVenueDetailsMutation();
  
  const handleEdit = (venue: Venue) => {
    setEditingVenue(venue);
    setShowEditModal(true);
  };

  const handleAdd = () => {
    router.push('/venue-owner/venues/add');
  };

  const handleDeleteVenue = async (venueId: string) => {
    if (!window.confirm('Are you sure you want to delete this venue?')) {
      return;
    }
    
    try {
      setIsDeleting(true);
      // TODO: Implement delete venue mutation when API is available
      // await deleteVenue(venueId).unwrap();
      toast({
        title: 'Venue deleted',
        description: 'The venue has been deleted successfully.',
      });
      refetch();
    } catch (error) {
      console.error('Error deleting venue:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete venue. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVenue) return;
    
    try {
      setIsUpdating(true);
      const updateData = {
        venueId: editingVenue.venueId,
        venueName: editingVenue.name,
        address: editingVenue.address,
        cityId: editingVenue.cityId,
        latitude: editingVenue.latitude || null,
        longitude: editingVenue.longitude || null,
        phoneNumber: editingVenue.phoneNumber,
        email: editingVenue.email,
        desc: editingVenue.description || '',
        openingTime: editingVenue.openingTime || null,
        closingTime: editingVenue.closingTime || null,
        isActive: editingVenue.isActive !== undefined ? editingVenue.isActive : true
      };
      
      await updateVenue(updateData).unwrap();
      
      toast({
        title: 'Venue updated',
        description: 'The venue has been updated successfully.',
      });
      setShowEditModal(false);
      refetch();
    } catch (error) {
      console.error('Error updating venue:', error);
      toast({
        title: 'Error',
        description: 'Failed to update venue. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const navigateToVenueDetails = (venueId: string) => {
    router.push(`/venue-owner/venues/${venueId}`);
  };

  if (isLoadingVenues) return <div>Loading venues...</div>;
  if (isError) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading venues</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Failed to load venues. Please try again later.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (

  // Edit modal
  const renderEditModal = () => (
    <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Venue</DialogTitle>
        </DialogHeader>
        {editingVenue && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Venue Name</Label>
              <Input
                id="name"
                value={editingVenue.name || ''}
                onChange={(e) => setEditingVenue({ ...editingVenue, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={editingVenue.address || ''}
                onChange={(e) => setEditingVenue({ ...editingVenue, address: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="cityName">City</Label>
              <Input
                id="cityName"
                value={editingVenue.cityName || ''}
                onChange={(e) => setEditingVenue({ ...editingVenue, cityName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={editingVenue.phoneNumber || ''}
                onChange={(e) => setEditingVenue({ ...editingVenue, phoneNumber: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editingVenue.email || ''}
                onChange={(e) => setEditingVenue({ ...editingVenue, email: e.target.value })}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );

    // TODO: Implement delete venue mutation when API is available
    // await deleteVenue(venueId).unwrap();
    toast({
      title: 'Venue deleted',
      description: 'The venue has been deleted successfully.',
    });
    refetch();
  } catch (error) {
    console.error('Error deleting venue:', error);
    toast({
      title: 'Error',
      description: 'Failed to delete venue. Please try again.',
      variant: 'destructive',
    });
  } finally {
    setIsDeleting(false);
  }
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!editingVenue) return;
  
  try {
    setIsUpdating(true);
    const updateData = {
      venueId: editingVenue.venueId,
      venueName: editingVenue.name,
      address: editingVenue.address,
      cityId: editingVenue.cityId,
      latitude: editingVenue.latitude || null,
      longitude: editingVenue.longitude || null,
      phoneNumber: editingVenue.phoneNumber,
      email: editingVenue.email,
      desc: editingVenue.description || '',
      openingTime: editingVenue.openingTime || null,
      closingTime: editingVenue.closingTime || null,
      isActive: editingVenue.isActive !== undefined ? editingVenue.isActive : true
    };
    
    await updateVenue(updateData).unwrap();
    
    toast({
      title: 'Venue updated',
      description: 'The venue has been updated successfully.',
    });
    setShowEditModal(false);
    refetch();
  } catch (error) {
    console.error('Error updating venue:', error);
    toast({
      title: 'Error',
      description: 'Failed to update venue. Please try again.',
      variant: 'destructive',
    });
  } finally {
    setIsUpdating(false);
  }
};

const navigateToVenueDetails = (venueId: string) => {
  router.push(`/venue-owner/venues/${venueId}`);
};

if (isLoadingVenues) return <div>Loading venues...</div>;
if (isError) {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Error loading venues</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>Failed to load venues. Please try again later.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by adding a new venue.
          </p>
          <div className="mt-6">
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Venue
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <Card key={venue.venueId} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    {venue.name}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(venue);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive/90"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteVenue(venue.venueId);
                      }}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
                <CardDescription className="line-clamp-2">
                  {venue.description || 'No description available'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="aspect-video w-full overflow-hidden rounded-md bg-muted">
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium w-20 text-muted-foreground">Address:</span>
                      <span className="flex-1">{venue.address || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium w-20 text-muted-foreground">City:</span>
                      <span>{venue.cityName || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium w-20 text-muted-foreground">Email:</span>
                      <span>{venue.email || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium w-20 text-muted-foreground">Phone:</span>
                      <span>{venue.phoneNumber || 'Not specified'}</span>
                    </div>
                  </div>
    </div>
  );
}

return (
  <div className="container mx-auto px-4 py-8">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">My Venues</h1>
      <Button onClick={handleAdd}>
        <Plus className="h-4 w-4 mr-2" />
        Add Venue
      </Button>
    </div>
    {renderEditModal()}

    {venues.length === 0 ? (
      <div className="text-center py-12">
        <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-medium">No venues</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Get started by adding a new venue.
        </p>
        <div className="mt-6">
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Venue
          </Button>
        </div>
      </div>
    ) : (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {venues.map((venue) => (
          <Card key={venue.venueId} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {venue.name}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(venue);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive hover:text-destructive/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteVenue(venue.venueId);
                    }}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
              <CardDescription className="line-clamp-2">
                {venue.description || 'No description available'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="aspect-video w-full overflow-hidden rounded-md bg-muted">
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                </div>
                
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium w-20 text-muted-foreground">Address:</span>
                    <span className="flex-1">{venue.address || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium w-20 text-muted-foreground">City:</span>
                    <span>{venue.cityName || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium w-20 text-muted-foreground">Email:</span>
                    <span>{venue.email || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium w-20 text-muted-foreground">Phone:</span>
                    <span>{venue.phoneNumber || 'Not specified'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )}
  </div>
);

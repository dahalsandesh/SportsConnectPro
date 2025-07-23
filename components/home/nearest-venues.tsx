'use client';

import { useEffect, useState } from 'react';
import { useGetVenuesQuery } from '@/redux/api/publicApi';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';

interface Venue {
  venueID: string;
  name: string;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  venueImages: Array<{ image: string }>;
}

interface Position {
  latitude: number;
  longitude: number;
}
const EARTH_RADIUS_KM = 6371;

// Haversine formula to calculate distance between two coordinates in kilometers
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((EARTH_RADIUS_KM * c).toFixed(2));
};

export default function NearestVenues() {
  const [userLocation, setUserLocation] = useState<Position | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showNearestVenues, setShowNearestVenues] = useState(false);
  
  const { data: venues = [], isLoading: isLoadingVenues } = useGetVenuesQuery();

  const getLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    // First check if we have permission
    let permissionStatus: PermissionStatus;
    try {
      // Using the Permissions API if available
      if (navigator.permissions) {
        permissionStatus = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      } else {
        // Fallback for browsers that don't support permissions API
        permissionStatus = { state: 'prompt' } as PermissionStatus;
      }

      // If permission was previously denied, show specific message
      if (permissionStatus.state === 'denied') {
        throw new Error('PERMISSION_DENIED');
      }

      // Request location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setShowNearestVenues(true);
          setIsLoadingLocation(false);
        },
        (error) => {
          handleGeolocationError(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } catch (error) {
      handleGeolocationError(error);
    }
  };

  const handleGeolocationError = (error: any) => {
    let errorMessage = 'Unable to retrieve your location. ';
    
    if (error.code === error.PERMISSION_DENIED || error.message === 'PERMISSION_DENIED') {
      errorMessage = 'Location permission is required to find nearby venues. Please enable location access in your browser settings and try again.';
    } else if (error.code === error.POSITION_UNAVAILABLE) {
      errorMessage = 'Your position is currently unavailable. Please check your internet connection and try again.';
    } else if (error.code === error.TIMEOUT) {
      errorMessage = 'The request to get your location timed out. Please try again.';
    } else {
      errorMessage = 'An error occurred while trying to get your location. Please try again later.';
    }
    
    console.error('Geolocation error:', error);
    setLocationError(errorMessage);
    setIsLoadingLocation(false);
  };

  // Filter and sort venues by distance
  const getNearestVenues = (): Array<Venue & { distance: number }> => {
    if (!userLocation) return [];

    return venues
      .filter((venue: Venue) => venue.latitude && venue.longitude)
      .map((venue: Venue) => ({
        ...venue,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          venue.latitude!,
          venue.longitude!
        ),
      }))
      .sort((a, b) => a.distance - b.distance);
  };

  const nearestVenues = getNearestVenues();
  const hasVenues = nearestVenues.length > 0;

  if (!showNearestVenues) {
    return (
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Find Venues Near You</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover and book sports venues near your current location. Click below to find the nearest facilities.
          </p>
          <Button 
            onClick={getLocation}
            disabled={isLoadingLocation}
            className="px-8 py-6 text-lg"
          >
            {isLoadingLocation ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Finding your location...
              </>
            ) : (
              <>
                <Navigation className="w-5 h-5 mr-2" />
                Find Venues Near Me
              </>
            )}
          </Button>
          {locationError && (
            <Alert variant="destructive" className="mt-6 max-w-2xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Location Error</AlertTitle>
              <AlertDescription>{locationError}</AlertDescription>
            </Alert>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Venues Near You</h2>
            {userLocation && (
              <p className="text-muted-foreground mt-2">
                Showing venues near your current location
              </p>
            )}
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowNearestVenues(false)}
            className="mt-4 md:mt-0"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Change Location
          </Button>
        </div>

        {isLoadingVenues ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-32" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : hasVenues ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearestVenues.map((venue) => (
              <Card key={venue.venueID} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 w-full">
                  {venue.venueImages?.length > 0 ? (
                    <Image
                      src={venue.venueImages[0].image}
                      alt={venue.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <MapPin className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm font-medium">
                    {venue.distance} km away
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{venue.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{venue.address}, {venue.city}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full text-white" asChild>
                    <a href={`/venues/${venue.venueID}`}>
                      View Details
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No venues found</AlertTitle>
            <AlertDescription>
              We couldn't find any venues with location data. Please try again later.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </section>
  );
}

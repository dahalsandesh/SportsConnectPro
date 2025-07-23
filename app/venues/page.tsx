'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VenueList from "@/components/venue-list";
import { useGetVenuesQuery } from "@/redux/api/publicApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function VenuesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  
  const { data: venues = [], isLoading, isError } = useGetVenuesQuery();

  // Toggle location tracking
  const toggleLocation = () => {
    if (userLocation) {
      // If location is already enabled, turn it off
      setUserLocation(null);
      setSortBy('default');
      setLocationError(null);
    } else {
      // If location is disabled, request it
      if (!navigator.geolocation) {
        setLocationError('Geolocation is not supported by your browser');
        return;
      }

      setIsLoadingLocation(true);
      setLocationError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setSortBy('nearest');
          setIsLoadingLocation(false);
        },
        (error) => {
          let errorMessage = 'Unable to retrieve your location. ';
          
          if (error.code === error.PERMISSION_DENIED) {
            errorMessage = 'Location permission was denied. Please enable location services in your browser settings.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMessage = 'Your position is currently unavailable. Please check your internet connection or try again later.';
          } else if (error.code === error.TIMEOUT) {
            errorMessage = 'The request to get your location timed out. Please try again.';
          }
          
          setLocationError(errorMessage);
          setIsLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(2));
  };

  // Filter and sort venues
  const getFilteredAndSortedVenues = () => {
    if (!Array.isArray(venues)) return [];
    
    let filteredVenues = [...venues];

    // Apply search filter
    if (searchTerm) {
      filteredVenues = filteredVenues.filter(venue => 
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (venue.address && venue.address.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply location filter
    if (locationFilter && locationFilter !== 'all') {
      filteredVenues = filteredVenues.filter(venue => 
        venue.city && venue.city.toLowerCase() === locationFilter.toLowerCase()
      );
    }

    // Add distance to venues if user location is available
    if (userLocation) {
      filteredVenues = filteredVenues.map(venue => ({
        ...venue,
        distance: venue.latitude && venue.longitude 
          ? calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              venue.latitude,
              venue.longitude
            )
          : null
      }));
    }

    // Sort venues
    if (sortBy === 'name') {
      filteredVenues.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'nearest' && userLocation) {
      filteredVenues = filteredVenues
        .filter(venue => venue.distance !== null)
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    return filteredVenues;
  };

  const filteredVenues = getFilteredAndSortedVenues();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Find Futsal Venues</h1>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by venue name or location"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Kathmandu">Kathmandu</SelectItem>
                <SelectItem value="Lalitpur">Lalitpur</SelectItem>
                <SelectItem value="Bhaktapur">Bhaktapur</SelectItem>
                <SelectItem value="Pokhara">Pokhara</SelectItem>
                <SelectItem value="Biratnagar">Biratnagar</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="nearest">Nearest First</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={userLocation ? 'default' : 'outline'}
              onClick={toggleLocation}
              disabled={isLoadingLocation}
              className="w-full sm:w-auto"
            >
              {isLoadingLocation ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Finding...
                </span>
              ) : userLocation ? (
                <span className="flex items-center">
                  <Navigation className="h-4 w-4 mr-2" />
                  Hide Nearby
                </span>
              ) : (
                <span className="flex items-center">
                  <Navigation className="h-4 w-4 mr-2" />
                  Find Near Me
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {locationError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Location Error</AlertTitle>
          <AlertDescription>{locationError}</AlertDescription>
        </Alert>
      )}

      {/* Venue Listing */}
      <VenueList venues={filteredVenues} />

      {/* Pagination - Removed for now as we're not implementing pagination yet */}
      {/* <div className="flex justify-center mt-8">
        <nav className="flex items-center gap-1">
          <Button variant="outline" size="icon" disabled>
            &lt;
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-green-600 text-white hover:bg-green-700">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="icon">
            &gt;
          </Button>
        </nav>
      </div> */}
    </div>
  );
}

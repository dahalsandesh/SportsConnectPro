"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  MapPin,
  Calendar,
  Settings,
  CreditCard,
  BarChart,
  MessageSquare,
  HelpCircle,
  Plus,
  Clock,
  Users,
  Activity,
  Trophy,
  Bell,
} from "lucide-react";
import { useGetVenuesQuery } from "@/redux/api/venue-owner/venueApi";
import { useState, useEffect } from "react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/venue-owner",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "My Venue",
    href: "/venue-owner/venues",
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    title: "Bookings",
    href: "/venue-owner/bookings",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: "Time Slots",
    href: "/venue-owner/availability",
    icon: <Clock className="h-5 w-5" />,
  },
  {
    title: "Payments",
    href: "/venue-owner/payments",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    title: "Analytics",
    href: "/venue-owner/analytics",
    icon: <BarChart className="h-5 w-5" />,
  },
  {
    title: "Events",
    href: "/venue-owner/events",
    icon: <Trophy className="h-5 w-5" />,
  },
  {
    title: "Media",
    href: "/venue-owner/media",
    icon: <Activity className="h-5 w-5" />,
  },
  // {
  //   title: "Messages",
  //   href: "/venue-owner/messages",
  //   icon: <MessageSquare className="h-5 w-5" />,
  // },
  // {
  //   title: "Settings",
  //   href: "/venue-owner/settings",
  //   icon: <Settings className="h-5 w-5" />,
  // },
  // {
  //   title: "Help",
  //   href: "/venue-owner/help",
  //   icon: <HelpCircle className="h-5 w-5" />,
  // },
];

export function VenueOwnerSidebarContent() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get user ID from localStorage when component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          const userId = user?.id || user?.userId || user?.user_id || null;
          setCurrentUserId(userId);
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error);
        }
      }
    }
  }, []);

  const {
    data: venuesData,
    isLoading,
    isError,
  } = useGetVenuesQuery(
    { userId: currentUserId || "" },
    { skip: !currentUserId }
  );
  const [openVenueId, setOpenVenueId] = useState<string | null>(null);
  const pathname = usePathname();

  // Ensure venues is always an array
  const venues = Array.isArray(venuesData) ? venuesData : [];

  return (
    <>
      <div className="px-4 py-2">
        {/* <Button className="w-full justify-start" asChild>
          <Link href="/venue-owner/venues/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Venue
          </Link>
        </Button> */}
      </div>
      <nav className="grid gap-1 px-2">
        {sidebarItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn(
              "justify-start gap-2",
              pathname === item.href && "bg-secondary"
            )}
            asChild>
            <Link href={item.href}>
              {item.icon}
              {item.title}
            </Link>
          </Button>
        ))}
        <div className="mt-4">
          <div className="font-semibold text-xs text-muted-foreground px-2 mb-1">
            My Venues
          </div>
          {isLoading && (
            <div className="text-xs text-muted-foreground px-2">
              Loading venues...
            </div>
          )}
          {isError && (
            <div className="text-xs text-red-500 px-2">
              Failed to load venues.
            </div>
          )}
          {!isLoading && !isError && venues.length === 0 && (
            <div className="text-xs text-muted-foreground px-2">
              No venues found.
            </div>
          )}
          {!isLoading &&
            !isError &&
            venues.map((venue) => (
              <div key={venue.venueId} className="mb-1">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-between text-left px-2 py-1 text-sm",
                    openVenueId === venue.venueId && "bg-secondary"
                  )}
                  onClick={() =>
                    setOpenVenueId(
                      openVenueId === venue.venueId ? null : venue.venueId
                    )
                  }>
                  <span>{venue.name}</span>
                  <span>{openVenueId === venue.venueId ? "-" : "+"}</span>
                </Button>
                {openVenueId === venue.venueId && (
                  <div className="ml-4 mt-1 flex flex-col gap-1">
                    <Link
                      href={`/venue-owner/venues/${venue.venueId}`}
                      className="text-xs hover:underline">
                      Overview
                    </Link>
                    <Link
                      href={`/venue-owner/venues/${venue.venueId}/courts`}
                      className="text-xs hover:underline">
                      Courts
                    </Link>
                    <Link
                      href={`/venue-owner/venues/${venue.venueId}/events`}
                      className="text-xs hover:underline">
                      Events
                    </Link>
                    <Link
                      href={`/venue-owner/venues/${venue.venueId}/media`}
                      className="text-xs hover:underline">
                      Media
                    </Link>
                  
                  </div>
                )}
              </div>
            ))}
        </div>
      </nav>
    </>
  );
}

export function VenueOwnerSidebar() {
  return (
    <aside className="hidden w-64 flex-col border-r bg-muted/40 lg:flex">
      <div className="flex h-14 items-center border-b px-4">
        <Link
          href="/venue-owner"
          className="flex items-center gap-2 font-semibold">
          <span className="text-primary">Venue</span>
          <span>Management</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <VenueOwnerSidebarContent />
      </div>
      <div className="border-t p-4">
        <div className="flex items-center gap-2 rounded-lg bg-muted p-4">
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Need help?</p>
            <p className="text-xs text-muted-foreground">Contact support</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

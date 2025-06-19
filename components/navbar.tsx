"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, User, LogIn, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import { useNotification } from "@/components/notification-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { notifications, addNotification } = useNotification();

  // Demo notification for first-time visitors
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setTimeout(() => {
        addNotification(
          "success",
          "Welcome to FutsalConnectPro!",
          "Find and book the best futsal courts in your area."
        );
        localStorage.setItem("hasVisited", "true");
      }, 2000);
    }
  }, [addNotification]);

  // Change navbar style on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/venues"
              className="text-gray-700 hover:text-green-600 font-medium">
              Find Venues
            </Link>
            <Link
              href="/how-it-works"
              className="text-gray-700 hover:text-green-600 font-medium">
              How It Works
            </Link>
            <Link
              href="/events"
              className="text-gray-700 hover:text-green-600 font-medium">
              Events
            </Link>
            <Link
              href="/register-venue"
              className="text-gray-700 hover:text-green-600 font-medium">
              List Your Venue
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-green-600 font-medium">
              Contact
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/my-bookings"
              className="text-gray-700 hover:text-green-600 font-medium">
              My Bookings
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  {notifications.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                      {notifications.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="p-3 border-b last:border-0">
                      <div>
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-sm text-gray-500">
                          {notification.message}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem className="p-3 text-center">
                    No notifications
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/login">
              <Button variant="outline" className="gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
                <User className="h-4 w-4" />
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu">
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/venues"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}>
              Find Venues
            </Link>
            <Link
              href="/how-it-works"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}>
              How It Works
            </Link>
            <Link
              href="/events"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}>
              Events
            </Link>
            <Link
              href="/register-venue"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}>
              List Your Venue
            </Link>
            <Link
              href="/my-bookings"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}>
              My Bookings
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              <Link
                href="/login"
                className="block w-full px-3 py-2 text-center text-base font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
            </div>
            <div className="mt-3 px-5 pb-3">
              <Link
                href="/signup"
                className="block w-full px-3 py-2 text-center text-base font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                onClick={() => setIsMenuOpen(false)}>
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

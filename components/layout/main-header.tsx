"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAppSelector } from "@/hooks/redux"
import { UserType } from "@/types/auth"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Menu,
  User,
  LogIn,
  LogOut,
  Bell,
  Settings,
  Calendar,
  Home,
  Search,
  Trophy,
  HelpCircle,
  Building2,
  ChevronDown,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useLogoutMutation } from "@/redux/services/authApi"
import { logout } from "@/redux/features/authSlice"
import { useAppDispatch } from "@/hooks/redux"
import { useToast } from "@/components/ui/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"

const mainNavItems = [
  {
    title: "Home",
    href: "/",
    icon: <Home className="h-4 w-4 mr-2" />,
  },
  {
    title: "Find Venues",
    href: "/venues",
    icon: <Search className="h-4 w-4 mr-2" />,
  },
  {
    title: "Events",
    href: "/events",
    icon: <Trophy className="h-4 w-4 mr-2" />,
  },
  {
    title: "How It Works",
    href: "/how-it-works",
    icon: <HelpCircle className="h-4 w-4 mr-2" />,
  },
  {
    title: "List Your Venue",
    href: "/register-venue",
    icon: <Building2 className="h-4 w-4 mr-2" />,
  },
]

export function MainHeader() {
  const [isMounted, setIsMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const { toast } = useToast()
  const [logoutApi] = useLogoutMutation()

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap()
      dispatch(logout())
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      })
    } catch (error) {
      console.error("Logout failed:", error)
      dispatch(logout())
    }
  }

  // Get user initials for avatar
  const initials = user?.fullName
    ? `${user.fullName.split(" ")[0][0]}${user.fullName.split(" ")[1]?.[0] || ""}`
    : user?.userName?.[0] || "U"

  // Determine dashboard link based on user type
  const getDashboardLink = () => {
    if (!isAuthenticated) return "/login"

    switch (user?.userType) {
      case UserType.Admin:
        return "/admin"
      case UserType.VenueOwner:
        return "/venue-owner"
      default:
        return "/dashboard"
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        "bg-background/95 backdrop-blur-md shadow-sm border-border/40",
        // Ensure visibility
        "visible opacity-100 block",
      )}
      style={{
        visibility: "visible",
        opacity: 1,
        display: "block",
        minHeight: "64px",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 focus-ring rounded-md p-1"
            style={{ visibility: "visible", opacity: 1 }}
          >
            <span className="text-xl font-bold text-primary">Sport</span>
            <span className="text-xl font-bold text-foreground">Connect</span>
            <span className="text-xl font-bold text-primary">Pro</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary focus-ring rounded-md px-3 py-2",
                  pathname === item.href ? "text-primary font-semibold" : "text-foreground/70 hover:text-primary",
                )}
                style={{ visibility: "visible", opacity: 1 }}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {!isMounted ? (
              // Render skeleton or null during SSR
              <div className="h-9 w-9" />
            ) : isAuthenticated ? (
              <>
                <Button variant="ghost" size="icon" className="relative h-9 w-9">
                  <Bell className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px] bg-primary text-primary-foreground">
                    3
                  </Badge>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 h-9 px-2 focus-ring">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                        {user?.fullName || user?.userName}
                      </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-foreground">
                          {user?.fullName || user?.userName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardLink()} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/bookings" className="cursor-pointer">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>My Bookings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className={buttonVariants({ variant: 'ghost', className: 'h-9' })}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Log in
                </Link>
                <Link 
                  href="/signup" 
                  className={buttonVariants({ className: 'h-9' })}
                >
                  <User className="mr-2 h-4 w-4" />
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center md:hidden">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2 h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {mainNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center text-sm font-medium transition-colors hover:text-primary p-2 rounded-md",
                        pathname === item.href
                          ? "bg-accent text-primary font-semibold"
                          : "text-foreground/70 hover:text-primary",
                      )}
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  ))}
                  <div className="h-px bg-border my-2" />
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center gap-4 p-2">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">
                            {user?.fullName || user?.userName}
                          </span>
                          <span className="text-xs text-muted-foreground">{user?.email}</span>
                        </div>
                      </div>
                      <Link
                        href={getDashboardLink()}
                        className="flex items-center text-sm font-medium p-2 rounded-md hover:bg-accent transition-colors"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/bookings"
                        className="flex items-center text-sm font-medium p-2 rounded-md hover:bg-accent transition-colors"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        My Bookings
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center text-sm font-medium p-2 rounded-md hover:bg-accent transition-colors"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center text-sm font-medium p-2 rounded-md hover:bg-accent text-left w-full transition-colors text-destructive"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button asChild variant="outline" className="w-full justify-start">
                        <Link href="/login">
                          <LogIn className="mr-2 h-4 w-4" />
                          Log in
                        </Link>
                      </Button>
                      <Button asChild className="w-full justify-start">
                        <Link href="/signup">
                          <User className="mr-2 h-4 w-4" />
                          Sign up
                        </Link>
                      </Button>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

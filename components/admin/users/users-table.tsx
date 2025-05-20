"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash, UserCog, Ban, CheckCircle } from "lucide-react"
import type { UserType } from "@/types/auth"

// Mock data for users - replace with actual API call
const mockUsers = [
  {
    id: "1",
    userName: "johndoe",
    email: "john@example.com",
    fullName: "John Doe",
    phoneNumber: "1234567890",
    userType: "NormalUsers" as UserType,
    isVerified: true,
    createdAt: "2023-01-01",
  },
  {
    id: "2",
    userName: "janedoe",
    email: "jane@example.com",
    fullName: "Jane Doe",
    phoneNumber: "0987654321",
    userType: "VenueOwner" as UserType,
    isVerified: true,
    createdAt: "2023-01-02",
  },
  {
    id: "3",
    userName: "admin",
    email: "admin@example.com",
    fullName: "Admin User",
    phoneNumber: "1122334455",
    userType: "Admin" as UserType,
    isVerified: true,
    createdAt: "2023-01-03",
  },
  {
    id: "4",
    userName: "sarahsmith",
    email: "sarah@example.com",
    fullName: "Sarah Smith",
    phoneNumber: "5566778899",
    userType: "NormalUsers" as UserType,
    isVerified: false,
    createdAt: "2023-01-04",
  },
]

interface UsersTableProps {
  userType: "all" | UserType
  searchQuery: string
}

export function UsersTable({ userType, searchQuery }: UsersTableProps) {
  const [users, setUsers] = useState(mockUsers)

  // Filter users based on userType and searchQuery
  const filteredUsers = users.filter((user) => {
    // Filter by user type
    if (userType !== "all" && user.userType !== userType) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        user.userName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.fullName.toLowerCase().includes(query) ||
        user.phoneNumber.includes(query)
      )
    }

    return true
  })

  const getUserTypeColor = (type: UserType) => {
    switch (type) {
      case "Admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "VenueOwner":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "NormalUsers":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={user.fullName} />
                      <AvatarFallback>
                        {user.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.fullName}</span>
                      <span className="text-xs text-muted-foreground">@{user.userName}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getUserTypeColor(user.userType)}>
                    {user.userType === "NormalUsers" ? "User" : user.userType}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.isVerified ? (
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    >
                      Verified
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                    >
                      Pending
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <UserCog className="mr-2 h-4 w-4" /> Change Role
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.isVerified ? (
                        <DropdownMenuItem className="text-amber-600">
                          <Ban className="mr-2 h-4 w-4" /> Suspend
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="text-green-600">
                          <CheckCircle className="mr-2 h-4 w-4" /> Verify
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"
import { useState } from "react"

interface City {
  id: string
  name: string
  state: string
  country: string
}

interface CityListProps {
  cities: City[]
  onAddCity: () => void
  onEditCity: (city: City) => void
  onDeleteCity: (city: City) => void
}

export function CityList({ cities, onAddCity, onEditCity, onDeleteCity }: CityListProps) {
  const [search, setSearch] = useState("")

  const filteredCities = (cities || []).filter(city =>
    city?.name?.toLowerCase().includes(search.toLowerCase()) ||
    city?.state?.toLowerCase().includes(search.toLowerCase()) ||
    city?.country?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Cities</CardTitle>
          <Button onClick={onAddCity}>
            <Plus className="w-4 h-4 mr-2" />
            Add City
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search cities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCities.map((city) => (
              <TableRow key={city.id}>
                <TableCell>{city.name}</TableCell>
                <TableCell>{city.state}</TableCell>
                <TableCell>{city.country}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditCity(city)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteCity(city)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

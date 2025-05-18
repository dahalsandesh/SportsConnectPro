import { CityList } from "@/components/admin/city/city-list"

export default function CitiesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">City Management</h1>
        <p className="text-muted-foreground">Manage cities for venue locations</p>
      </div>
      <CityList />
    </div>
  )
}

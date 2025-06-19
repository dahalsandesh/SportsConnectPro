export default function AdminBookingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bookings Management</h1>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p>Bookings management content will be displayed here.</p>
        <p className="text-red-500 mt-4">
          Note: The API endpoint for fetching all bookings is not available.
          This page is a placeholder.
        </p>
      </div>
    </div>
  );
}

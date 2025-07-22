import BookingManagement from "./BookingManagement";

export default function AdminBookingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bookings Management</h1>
      </div>
      <BookingManagement />
    </div>
  );
}


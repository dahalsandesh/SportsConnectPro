import { Metadata } from 'next'
import { MyBookings } from '@/components/bookings/my-bookings'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'My Bookings | SportsConnect Pro',
  description: 'View and manage your upcoming and past bookings',
}

export default function MyBookingsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <MyBookings />
        </CardContent>
      </Card>
    </div>
  )
}

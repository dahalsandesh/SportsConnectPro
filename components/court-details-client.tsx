"use client";
import Image from "next/image";
import Link from "next/link";
import { useGetCourtByIdQuery } from "@/redux/api/publicApi";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Star, MapPin, Clock } from "lucide-react";

export default function CourtDetailsClient({ courtId }: { courtId: string }) {
  const { data: court, isLoading, isError } = useGetCourtByIdQuery(courtId);
  const fallbackImage =
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=300&fit=crop&crop=center";

  if (isLoading) return <div>Loading court details...</div>;
  if (isError || !court) return <div>Failed to load court details.</div>;

  const images = court.courtImages && court.courtImages.length > 0 ? court.courtImages : [{ image: fallbackImage }];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/venues" className="text-muted-foreground hover:text-green-600">&larr; Back to Venues</Link>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <div className="grid grid-cols-1 gap-4">
            {images.map((img: any, idx: number) => (
              <div key={idx} className="relative h-64 w-full rounded-lg overflow-hidden">
                <Image src={img.image} alt={court.name} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="md:w-1/2">
          <Card className="mb-4">
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold mb-2 text-foreground">{court.name}</h1>
              <div className="flex items-center mb-2">
                <Badge variant="outline" className="border-green-600 text-green-600 bg-green-50 dark:bg-green-950 mr-2">
                  {court.sportCategory}
                </Badge>
                <Badge variant="outline" className="ml-2 border-green-600 text-green-600 bg-green-50 dark:bg-green-950">
                  {court.surfaceType}
                </Badge>
              </div>
              <div className="flex items-center text-muted-foreground mb-2">
                <Users className="h-4 w-4 mr-1" />
                <span>{court.capacity} players</span>
              </div>
              <div className="flex items-center text-muted-foreground mb-2">
                <Clock className="h-4 w-4 mr-1" />
                <span>Created: {court.createdAt ? new Date(court.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-600 font-bold text-xl mr-2">Rs. {court.hourlyRate}</span>
                <span className="text-muted-foreground text-sm">/hour</span>
              </div>
              <div className="mt-4">
                <Badge className={court.isActive ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'}>
                  {court.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>
          {/* Optionally add booking or other actions here */}
        </div>
      </div>
    </div>
  );
}

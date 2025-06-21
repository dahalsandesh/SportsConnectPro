"use client";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Users, Star } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface Court {
  courtID: string;
  id?: string;
  name: string;
  sportCategory: string;
  surfaceType: string;
  capacity: number;
  hourlyRate: number;
  isActive: boolean;
  createdAt?: string;
  courtImages?: { imageID: string; image: string }[];
}

interface CourtCardProps {
  court: Court;
  fallbackImage: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function CourtCard({ 
  court, 
  fallbackImage, 
  href, 
  onClick,
  className 
}: CourtCardProps) {
  const imageUrl = court.courtImages?.[0]?.image || fallbackImage;
  
  const cardContent = (
    <div 
      className={cn(
        "overflow-hidden h-full transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700",
        className,
        { "cursor-pointer": href || onClick }
      )}
      onClick={onClick}
    >
      <div className="relative h-48">
        <Image
          src={imageUrl}
          alt={court.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-green-600 text-white border-0 shadow-md">
            <Star className="h-3 w-3 mr-1 fill-current" />
            {court.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2 text-foreground">{court.name}</h3>
        <div className="flex items-center text-muted-foreground mb-2">
          <span className="text-sm font-medium mr-2">{court.sportCategory}</span>
          <Badge variant="outline" className="ml-2 border-green-600 text-green-600 bg-green-50 dark:bg-green-950">
            {court.surfaceType}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Users className="h-4 w-4 mr-1" />
          <span>{court.capacity} players</span>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-green-600 font-bold text-lg">Rs. {court.hourlyRate}</span>
          <span className="text-muted-foreground text-sm">/hour</span>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link 
        href={href} 
        className="block focus:outline-none focus:ring-2 focus:ring-green-600 rounded-lg group"
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
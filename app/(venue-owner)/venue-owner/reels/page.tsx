import { Metadata } from "next";
import VenueOwnerReelsPage from "@/components/venue-owner/reels";

export const metadata: Metadata = {
  title: "Reels | Venue Owner",
  description: "Manage your venue's video reels",
};

export default function Page() {
  return <VenueOwnerReelsPage />;
}

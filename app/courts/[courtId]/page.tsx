import CourtDetailsClient from "@/components/court-details-client";

export default function CourtDetailPage({ params }: { params: { courtId: string } }) {
  return <CourtDetailsClient courtId={params.courtId} />;
}

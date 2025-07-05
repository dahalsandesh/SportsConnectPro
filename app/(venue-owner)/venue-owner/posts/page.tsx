import { VenueNewsMedia } from "../components/VenueNewsMedia";

export default function PostsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Posts & News</h1>
          <p className="text-muted-foreground">
            Manage your venue posts and news
          </p>
        </div>
      </div>
      
      <VenueNewsMedia />
    </div>
  );
}

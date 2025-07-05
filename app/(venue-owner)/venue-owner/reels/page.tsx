import { ReelsManagement } from "../components/ReelsManagement";

export default function ReelsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reels</h1>
          <p className="text-muted-foreground">
            Manage your venue reels and videos
          </p>
        </div>
      </div>
      
      <ReelsManagement />
    </div>
  );
}

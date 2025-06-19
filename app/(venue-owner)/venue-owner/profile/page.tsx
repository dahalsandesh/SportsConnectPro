import ProfileManagement from "../components/ProfileManagement";

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Profile Management</h1>
        <p className="text-muted-foreground">
          Manage your venue owner profile and account settings
        </p>
      </div>
      <ProfileManagement />
    </div>
  );
}

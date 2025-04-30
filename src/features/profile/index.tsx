import Navbar from "@/components/Navbar";
import ProfileSection from "./components/ProfileSection";
import RefferalSection from "./components/RefferalSection";

export default function ProfilePage() {
  return (
    <>
      <Navbar />
      <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-muted-foreground">
                Manage your account settings and view rewards
              </p>
            </div>
          </div>

          <ProfileSection />
          <RefferalSection />
        </div>
      </section>
    </>
  );
}

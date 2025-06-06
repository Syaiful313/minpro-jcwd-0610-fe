// "use client";
import ProfilePage from "@/features/profile";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Profile = async () => {
  const session = await auth();

  if (!session) return redirect("/login");

  return (
    <main className="bg-white">
      <ProfilePage />;
    </main>
  );
};

export default Profile;

import DashboardAdminUserPage from "@/features/dashboard/admin/users";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const DashboardAdminUser = async () => {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");
  return <DashboardAdminUserPage />;
};

export default DashboardAdminUser;

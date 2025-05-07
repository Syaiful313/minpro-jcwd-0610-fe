import DashboardAdminPage from "@/features/dashboard/admin";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const DashboardAdmin = async () => {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");
  
  return <DashboardAdminPage />;
};

export default DashboardAdmin;

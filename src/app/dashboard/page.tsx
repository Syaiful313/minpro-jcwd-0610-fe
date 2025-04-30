import DashboardPage from "@/features/dashboard";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user.role !== "ORGANIZER") redirect("/");

  return <DashboardPage />;
};

export default Dashboard;

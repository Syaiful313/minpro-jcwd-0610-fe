import DashboardEventsPage from "@/features/dashboard/events";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const DashboardEvents = async () => {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user.role !== "ORGANIZER") redirect("/");
  return <DashboardEventsPage />;
};

export default DashboardEvents;

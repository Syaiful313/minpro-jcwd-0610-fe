import EventDetailPage from "@/features/dashboard/events/EventDetailPage";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const EventDetail = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const slug = (await params).slug;
  const session = await auth();
  
  if (!session) return redirect("/login");
  if (session.user.role !== "ORGANIZER") redirect("/");
  return <EventDetailPage slug={slug} />;
};

export default EventDetail;

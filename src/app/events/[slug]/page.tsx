import EventDetailPage from "@/features/event/EventDetailPage";

const EventDetail = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const slug = (await params).slug;
  return <EventDetailPage slug={slug} />;
};

export default EventDetail;

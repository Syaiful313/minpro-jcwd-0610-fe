"use client";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import useGetEventBySlug from "@/hooks/api/event/useGetEventBySlug";
import { FC, useEffect, useState } from "react";
import { AttendeesTableDetail } from "./components/AttendeesTableDetail";
import { SiteHeaderEventDetail } from "./components/SiteHeaderEventDetail";
import { AppSidebar } from "../components/AppSidebar";

interface EventDetailPageProps {
  slug: string;
}

const EventDetailPage: FC<EventDetailPageProps> = ({ slug }) => {
  const { data: eventData, isLoading } = useGetEventBySlug(slug);
  const [eventName, setEventName] = useState<string>("");

  useEffect(() => {
    if (eventData?.name) {
      setEventName(eventData.name);
    }
  }, [eventData]);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeaderEventDetail eventName={eventName} />
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              {isLoading ? "Loading..." : eventName || "Event"} Attendees
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor attendees for this event
            </p>
          </div>
          <AttendeesTableDetail slug={slug} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default EventDetailPage;

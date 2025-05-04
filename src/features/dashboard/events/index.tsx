import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebarEvent } from "./components/AppSidebar";
import { EventsTable } from "./components/EventTable";
import { SiteHeaderEvent } from "./components/SiteHeaderEvent";

const DashboardEventsPage = () => {
  return (
    <SidebarProvider>
      <AppSidebarEvent variant="inset" />
      <SidebarInset>
        <SiteHeaderEvent />
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Your Events</h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor all your events in one place. Create new events, view attendees, and track performance.
            </p>
          </div>
          <EventsTable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardEventsPage;
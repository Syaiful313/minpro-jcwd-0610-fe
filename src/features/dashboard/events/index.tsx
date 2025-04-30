import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/AppSidebar";
import { SiteHeaderEvent } from "./components/SiteHeader";
import { EventsTable } from "./components/DataTableEvents";

const DashboardEventsPage = () => {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeaderEvent />
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-6">Your Events</h1>
          <EventsTable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardEventsPage;

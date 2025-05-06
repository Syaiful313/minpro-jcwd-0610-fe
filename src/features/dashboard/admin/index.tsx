import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { OrganizerDashboardCards } from "../components/OrganizerDashboardCards";
import { TransactionChart } from "../components/TransactionChart";
import { AppSidebarAdmin } from "./components/AppSidebar";
import { SiteHeaderAdmin } from "./components/SiteHeader";

export default function DashboardAdminPage() {
  return (
    <SidebarProvider>
      <AppSidebarAdmin variant="inset" />
      <SidebarInset>
        <SiteHeaderAdmin />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

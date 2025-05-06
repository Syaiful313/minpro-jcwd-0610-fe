import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebarAdmin } from "../components/AppSidebar";
import { SiteHeaderUsers } from "./components/SiteHeaderUsers";
import { UserTable } from "./components/UserTable";

export default function DashboardAdminUserPage() {
  return (
    <SidebarProvider>
      <AppSidebarAdmin variant="inset" />
      <SidebarInset>
        <SiteHeaderUsers />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <UserTable />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

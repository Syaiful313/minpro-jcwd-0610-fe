import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { AppSidebar } from "./components/AppSidebar"
import { SectionCards } from "./components/SectionCard"
import { SiteHeader } from "./components/SiteHeader"

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

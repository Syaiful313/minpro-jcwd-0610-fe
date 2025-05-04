import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";

interface SiteHeaderEventDetailProps {
  eventName?: string;
}

export function SiteHeaderEventDetail({
  eventName,
}: SiteHeaderEventDetailProps) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-1 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-1 px-2 sm:px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-1 sm:mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb className="overflow-hidden">
          <BreadcrumbList className="flex-wrap">
            <BreadcrumbItem>
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-primary text-sm sm:text-base font-medium whitespace-nowrap"
              >
                Dashboard
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link
                href="/dashboard/events"
                className="text-muted-foreground hover:text-primary text-sm sm:text-base font-medium whitespace-nowrap"
              >
                Events
              </Link>
            </BreadcrumbItem>
            {eventName && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="max-w-[calc(100%-90px)] sm:max-w-none">
                  <BreadcrumbPage className="text-primary text-sm sm:text-base font-medium truncate">
                    {eventName}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
// src/components/OrganizerDashboardCards.tsx

"use client";

import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useGetOrganizerDashboardData from "@/hooks/api/dasboard-organizer/useGetOrganizerDashboardData";
import { formatRupiah } from "@/lib/formatters";

export function OrganizerDashboardCards() {
  const { data, isLoading, error } = useGetOrganizerDashboardData();

  if (isLoading) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Card className="@container/card animate-pulse">
          <CardHeader className="h-24"></CardHeader>
          <CardFooter className="h-16"></CardFooter>
        </Card>
        <Card className="@container/card animate-pulse">
          <CardHeader className="h-24"></CardHeader>
          <CardFooter className="h-16"></CardFooter>
        </Card>
        <Card className="@container/card animate-pulse">
          <CardHeader className="h-24"></CardHeader>
          <CardFooter className="h-16"></CardFooter>
        </Card>
        <Card className="@container/card animate-pulse">
          <CardHeader className="h-24"></CardHeader>
          <CardFooter className="h-16"></CardFooter>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Terjadi kesalahan saat memuat data dashboard
      </div>
    );
  }

  const dashboardData = data?.data;

  if (!dashboardData) {
    return null;
  }

  const {
    organizerName,
    totalRevenue,
    totalEvents,
    ticketsSold,
    revenueGrowth,
    customerGrowth,
  } = dashboardData;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Nama Organizer</CardDescription>
          <CardTitle className="text-2xl font-semibold @[250px]/card:text-3xl">
            {organizerName}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {organizerName}
          </div>
          <div className="text-muted-foreground">Penyelenggara event</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total Pendapatan</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatRupiah(totalRevenue)}
          </CardTitle>
          <div className="absolute top-4 right-4">
            <Badge
              variant={revenueGrowth >= 0 ? "outline" : "destructive"}
              className="flex gap-1 rounded-lg text-xs"
            >
              {revenueGrowth >= 0 ? (
                <TrendingUpIcon className="size-3" />
              ) : (
                <TrendingDownIcon className="size-3" />
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {revenueGrowth >= 0 ? "Meningkat" : "Menurun"} dibanding bulan lalu
            {revenueGrowth >= 0 ? (
              <TrendingUpIcon className="size-4" />
            ) : (
              <TrendingDownIcon className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            Total pendapatan dari semua event
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Pelanggan Baru</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {ticketsSold}
          </CardTitle>
          <div className="absolute top-4 right-4">
            <Badge
              variant={customerGrowth >= 0 ? "outline" : "destructive"}
              className="flex gap-1 rounded-lg text-xs"
            >
              {customerGrowth >= 0 ? (
                <TrendingUpIcon className="size-3" />
              ) : (
                <TrendingDownIcon className="size-3" />
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Tiket yang berhasil terjual
            {customerGrowth >= 0 ? (
              <TrendingUpIcon className="size-4" />
            ) : (
              <TrendingDownIcon className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            Total tiket yang dibeli pelanggan
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total Event</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalEvents}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Event yang aktif
          </div>
          <div className="text-muted-foreground">
            Total event yang belum dihapus
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

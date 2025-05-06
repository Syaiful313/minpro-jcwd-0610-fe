"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useTransactionStatusChartData from "@/hooks/api/dasboard-organizer/useGetTransactionStatusChartData";

const chartConfig = {
  waiting: {
    label: "Menunggu Pembayaran",
    color: "hsl(var(--chart-1))",
  },
  confirmed: {
    label: "Menunggu Konfirmasi",
    color: "hsl(var(--chart-2))",
  },
  done: {
    label: "Selesai",
    color: "hsl(var(--chart-3))",
  },
  rejected: {
    label: "Ditolak",
    color: "hsl(var(--chart-4))",
  },
  canceled: {
    label: "Dibatalkan",
    color: "hsl(var(--chart-5))",
  },
  expired: {
    label: "Kadaluarsa",
    color: "hsl(var(--chart-6))",
  },
} satisfies ChartConfig;

export function TransactionChart() {
  const [timeRange, setTimeRange] = React.useState<
    "7d" | "30d" | "90d" | "365d"
  >("365d");

  const { data, isLoading, error } = useTransactionStatusChartData({
    timeRange,
  });

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const isMobile = window.innerWidth < 768;

    if (timeRange === "365d") {
      return dateObj.toLocaleDateString("id-ID", {
        month: isMobile ? "numeric" : "short",
        year: "2-digit",
      });
    } else {
      return dateObj.toLocaleDateString("id-ID", {
        month: isMobile ? "numeric" : "short",
        day: "numeric",
      });
    }
  };

  const [chartHeight, setChartHeight] = React.useState(250);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setChartHeight(200);
      } else {
        setChartHeight(250);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-col items-center gap-2 space-y-2 border-b px-4 py-4 sm:flex-row sm:space-y-0 sm:px-6 sm:py-5">
        <div className="grid w-full flex-1 gap-1 text-center sm:w-auto sm:text-left">
          <CardTitle className="text-lg sm:text-xl">
            Grafik Status Transaksi
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Menampilkan transaksi berdasarkan status untuk{" "}
            {timeRange === "365d"
              ? "1 tahun terakhir"
              : timeRange === "90d"
                ? "3 bulan terakhir"
                : timeRange === "30d"
                  ? "30 hari terakhir"
                  : "7 hari terakhir"}
          </CardDescription>
        </div>
        <Select
          value={timeRange}
          onValueChange={(value: "7d" | "30d" | "90d" | "365d") =>
            setTimeRange(value)
          }
        >
          <SelectTrigger
            className="w-full rounded-lg text-sm sm:ml-auto sm:w-[160px]"
            aria-label="Pilih jangka waktu"
          >
            <SelectValue placeholder="Pilih rentang waktu" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="365d" className="rounded-lg text-sm">
              1 tahun terakhir
            </SelectItem>
            <SelectItem value="90d" className="rounded-lg text-sm">
              3 bulan terakhir
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg text-sm">
              30 hari terakhir
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg text-sm">
              7 hari terakhir
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="flex h-[200px] items-center justify-center sm:h-[250px]">
            <p className="text-sm sm:text-base">Memuat data...</p>
          </div>
        ) : error ? (
          <div className="flex h-[200px] items-center justify-center sm:h-[250px]">
            <p className="text-sm text-red-500 sm:text-base">
              Terjadi kesalahan saat memuat data
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <div
              className="min-w-[300px]"
              style={{ height: `${chartHeight}px` }}
            >
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data?.data || []}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="fillWaiting"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--color-waiting)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-waiting)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="fillConfirmed"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--color-confirmed)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-confirmed)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient id="fillDone" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="var(--color-done)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-done)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="fillRejected"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--color-rejected)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-rejected)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="fillCanceled"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--color-canceled)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-canceled)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="fillExpired"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--color-expired)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-expired)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={window.innerWidth < 768 ? 60 : 32}
                      tick={{ fontSize: window.innerWidth < 768 ? 10 : 12 }}
                      tickFormatter={formatDate}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          labelFormatter={(value) => {
                            return new Date(value).toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            });
                          }}
                          indicator="dot"
                        />
                      }
                    />
                    <Area
                      dataKey="waiting"
                      type="monotone"
                      fill="url(#fillWaiting)"
                      stroke="var(--color-waiting)"
                      strokeWidth={2}
                      stackId="a"
                    />
                    <Area
                      dataKey="confirmed"
                      type="monotone"
                      fill="url(#fillConfirmed)"
                      stroke="var(--color-confirmed)"
                      strokeWidth={2}
                      stackId="a"
                    />
                    <Area
                      dataKey="done"
                      type="monotone"
                      fill="url(#fillDone)"
                      stroke="var(--color-done)"
                      strokeWidth={2}
                      stackId="a"
                    />
                    <Area
                      dataKey="rejected"
                      type="monotone"
                      fill="url(#fillRejected)"
                      stroke="var(--color-rejected)"
                      strokeWidth={2}
                      stackId="a"
                    />
                    <Area
                      dataKey="canceled"
                      type="monotone"
                      fill="url(#fillCanceled)"
                      stroke="var(--color-canceled)"
                      strokeWidth={2}
                      stackId="a"
                    />
                    <Area
                      dataKey="expired"
                      type="monotone"
                      fill="url(#fillExpired)"
                      stroke="var(--color-expired)"
                      strokeWidth={2}
                      stackId="a"
                    />
                    <ChartLegend
                      content={
                        <ChartLegendContent className="text-xs sm:text-sm" />
                      }
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

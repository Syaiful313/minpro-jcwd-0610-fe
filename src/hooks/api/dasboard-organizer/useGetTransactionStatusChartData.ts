// src/hooks/api/dasboard-organizer/useGetTransactionStatusChartData.ts

import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";

// Interface untuk parameter query
interface TransactionStatusChartQueries {
  timeRange: "7d" | "30d" | "90d" | "365d";
}

// Interface untuk data respons
export interface TransactionStatusDataPoint {
  date: string;
  waiting: number;
  confirmed: number;
  done: number;
  rejected: number;
  canceled: number;
  expired: number;
}

export interface TransactionStatusChartResponse {
  data: TransactionStatusDataPoint[];
  message: string;
}

/**
 * Hook untuk mengambil data chart transaksi berdasarkan status
 */
const useTransactionStatusChartData = (queries: TransactionStatusChartQueries) => {
  const { timeRange } = queries;
  const { axiosInstance } = useAxios();
  
  return useQuery({
    queryKey: ["transaction-status-chart", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<TransactionStatusChartResponse>(
        "/organizer/events/chart",
        {
          params: {
            timeRange,
          },
        }
      );
      return data;
    },
  });
};

export default useTransactionStatusChartData;
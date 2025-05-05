import axiosInstance from "@/lib/axios";
import { Transaction } from "@/types/transactions";
import { PageableResponse, PaginationQueries } from "@/types/Pagination";
import { useQuery } from "@tanstack/react-query";
import { TransactionStatus } from "@/types/enums";

interface GetOrganizerTransactionsQuery extends PaginationQueries {
  search?: string;
  status?: TransactionStatus | "ALL";
}

const useGetOrganizerTransactions = (queries: GetOrganizerTransactionsQuery) => {
  return useQuery({
    queryKey: ["organizer-transactions", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<Transaction>>(
        "/organizer/events/transactions",
        {
          params: queries,
        },
      );
      return data;
    },
  });
};

export default useGetOrganizerTransactions;
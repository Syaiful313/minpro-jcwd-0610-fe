import axiosInstance from "@/lib/axios";
import { TransactionStatus } from "@/types/enums";
import { PageableResponse, PaginationQueries } from "@/types/Pagination";
import { Transaction, TransactionDetail } from "@/types/transactions";
import { useQuery } from "@tanstack/react-query";

export interface TransactionWithDetails extends Transaction {
  transactionsDetails: TransactionDetail[];
}

interface GetOrganizerTransactionsQuery extends PaginationQueries {
  search?: string;
  status?: TransactionStatus | "ALL";
}

const useGetOrganizerTransactions = (
  queries: GetOrganizerTransactionsQuery,
) => {
  return useQuery({
    queryKey: ["organizer-transactions", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<
        PageableResponse<TransactionWithDetails>
      >("/organizer/events/transactions", {
        params: queries,
      });
      return data;
    },
  });
};

export default useGetOrganizerTransactions;

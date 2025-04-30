import { Referral } from "@/types/referral";
import { PageableResponse, PaginationQueries } from "@/types/Pagination";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

interface GetReferralsQuery extends PaginationQueries {
  search?: string;
  status?: string;
}

const useGetReferrals = (queries: GetReferralsQuery) => {
  return useQuery({
    queryKey: ["referrals", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<Referral>>(
        "/referrals",
        {
          params: queries,
        },
      );
      return data;
    },
  });
};

export default useGetReferrals;
import axiosInstance from "@/lib/axios";
import { Coupon } from "@/types/coupon";
import { PageableResponse, PaginationQueries } from "@/types/Pagination";
import { useQuery } from "@tanstack/react-query";

interface GetCouponsQuery extends PaginationQueries {
  search?: string;
  status?: string;
}

const useGetCoupons = (queries: GetCouponsQuery) => {
  return useQuery({
    queryKey: ["coupons", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<Coupon>>(
        "/coupons",
        {
          params: queries,
        },
      );
      return data;
    },
  });
};

export default useGetCoupons;
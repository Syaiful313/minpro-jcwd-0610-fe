import axiosInstance from "@/lib/axios";
import { PageableResponse, PaginationQueries } from "@/types/Pagination";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

interface GetUsersQueries extends PaginationQueries {
  search?: string;
  organizerApproved?: boolean;
  organizerPending?: boolean;
}

const useGetUsers = (queries: GetUsersQueries) => {
  const { ...params } = queries;
  return useQuery({
    queryKey: ["user-lists", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<User>>(
        "/admin/user-lists",
        {
          params,
        },
      );
      return data;
    },
  });
};

export default useGetUsers;

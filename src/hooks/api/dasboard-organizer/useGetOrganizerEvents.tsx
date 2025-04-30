import  axiosInstance  from "@/lib/axios";
import { Event } from "@/types/event";
import { PageableResponse, PaginationQueries } from "@/types/Pagination";
import { useQuery } from "@tanstack/react-query";

interface GetOrganizereventsQuery extends PaginationQueries {
  search?: string;
  status?: string;
}

const useGetOrganizerevents = (queries: GetOrganizereventsQuery) => {
  return useQuery({
    queryKey: ["organizer-events", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<Event>>(
        "/organizer/events",
        {
          params: queries,
        },
      );
      return data;
    },
  });
};

export default useGetOrganizerevents;

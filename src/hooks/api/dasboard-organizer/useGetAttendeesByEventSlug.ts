import axiosInstance from "@/lib/axios";
import { PageableResponse, PaginationQueries } from "@/types/Pagination";
import { useQuery } from "@tanstack/react-query";

interface Attendee {
  id: number;
  user: {
    fullName: string;
    email: string;
  };
  status: string;
  event: {
    name: string;
  };
  quantity: number;
  totalPrice: number;
  ticketType?: {
    name: string;
  };
}

interface GetAttendeesQuery extends PaginationQueries {
  search?: string;
}

const useGetAttendeesByEventSlug = (
  slug: string, 
  queries?: GetAttendeesQuery,
  options?: { enabled?: boolean }
) => {
  const {
    page = 1,
    take = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    search = "",
  } = queries || {};

  return useQuery({
    queryKey: ["event-attendees", slug, page, take, sortBy, sortOrder, search],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<Attendee>>(
        `/organizer/events/attendees/${slug}`,
        {
          params: {
            page,
            take,
            sortBy,
            sortOrder,
            search,
          },
        }
      );
      return data;
    },
    enabled: options?.enabled !== false && !!slug,
  });
};

export default useGetAttendeesByEventSlug;
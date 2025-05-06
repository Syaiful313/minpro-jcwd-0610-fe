import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";

interface OrganizerDashboardData {
  organizerName: string;
  totalRevenue: number;
  totalEvents: number;
  ticketsSold: number;
  revenueGrowth: number;
  customerGrowth: number;
}

interface OrganizerDashboardResponse {
  data: OrganizerDashboardData;
  message: string;
}

const useGetOrganizerDashboardData = () => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ["organizer-dashboard"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<OrganizerDashboardResponse>(
        "/organizer/events/data",
      );
      return data;
    },
  });
};

export default useGetOrganizerDashboardData;

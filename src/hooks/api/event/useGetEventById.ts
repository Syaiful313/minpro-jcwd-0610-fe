import useAxios from "@/hooks/useAxios";
import { Event } from "@/types/event";
import { useQuery } from "@tanstack/react-query";

const useGetEventById = (id: number) => {
  const { axiosInstance } = useAxios();
  return useQuery({
    queryKey: ["event", "detail", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Event>(`/events/id/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export default useGetEventById;

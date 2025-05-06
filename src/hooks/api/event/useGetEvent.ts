"use client";

import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

const useGetEvent = (eventId: string | number) => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ["event", eventId?.toString()],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(`/events/${eventId}`);
        return data?.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          const errorMessage =
            error.response?.data?.message || "Gagal mendapatkan data event";
          toast.error(errorMessage);
        }
        throw error;
      }
    },
    enabled: !!eventId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export default useGetEvent;

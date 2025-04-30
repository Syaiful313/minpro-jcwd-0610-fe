"use client";

import axiosInstance from "@/lib/axios";
import { IEvent } from "@/types/Event";
import { useQuery } from "@tanstack/react-query";

const useGetEventBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["event", slug],
    queryFn: async () => {
      const { data } = await axiosInstance.get<IEvent>(`/events/${slug}`);
      return data;
    },
  });
};
export default useGetEventBySlug;

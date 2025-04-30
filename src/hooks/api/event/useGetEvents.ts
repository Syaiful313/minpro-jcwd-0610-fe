"use client";

import axiosInstance from "@/lib/axios";
import { Event } from "@/types/event";
import { PageableResponse } from "@/types/Pagination";
import { useQuery } from "@tanstack/react-query";

const useGetEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      try {
        const response =
          await axiosInstance.get<PageableResponse<Event>>("/events");
        return {
          events: response.data.data || [],
        };
      } catch (error) {
        console.error("Error fetching events:", error);
        throw new Error("Failed to fetch events");
      }
    },
  });
};

export default useGetEvents;

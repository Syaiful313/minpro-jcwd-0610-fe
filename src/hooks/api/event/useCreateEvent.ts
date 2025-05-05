"use client";

import useAxios from "@/hooks/useAxios";
import axiosInstance from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface CreateEventPayload {
  name: string;
  thumbnail: File | null;
  description: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
  tickets: string; // Add these
  vouchers: string; // Add these
}

const useCreateEvent = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { axiosInstance } = useAxios();

  return useMutation({
    mutationFn: async (payload: CreateEventPayload) => {
      const createEventForm = new FormData();



      createEventForm.append("name", payload.name);
      if (payload.thumbnail) {
        createEventForm.append("thumbnail", payload.thumbnail);
      }
      createEventForm.append("description", payload.description);
      createEventForm.append("category", payload.category);
      createEventForm.append("location", payload.location);
      createEventForm.append("startDate", new Date(payload.startDate).toISOString());
      createEventForm.append("endDate", new Date(payload.endDate).toISOString());
      createEventForm.append("tickets", payload.tickets); // Add these
      createEventForm.append("vouchers", payload.vouchers); // Add these



      const data = await axiosInstance.post("/events/createevent", createEventForm);
      return data;
    },
    onSuccess: async () => {
      toast.success("Create Event successfully");
      await queryClient.invalidateQueries({ queryKey: ["events"] });
      router.push("/");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message || "Something went wrong");
    },
  });
};

export default useCreateEvent;
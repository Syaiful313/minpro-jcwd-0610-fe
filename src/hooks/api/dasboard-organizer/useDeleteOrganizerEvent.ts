"use client";
import axiosInstance from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface DeleteEventResponse {
  status: string;
  message: string;
  data: {
    id: number;
    name: string;
    deletedAt: string;
  };
}

const useDeleteOrganizerEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: number): Promise<DeleteEventResponse> => {
      const { data } = await axiosInstance.delete<DeleteEventResponse>(
        `/organizer/events/${eventId}`,
      );
      return data;
    },

    onSuccess: (data) => {
      toast.success(data.message || "Event deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["organizer-events"] });
    },

    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message || error.response?.data);
    },
  });
};

export default useDeleteOrganizerEvent;

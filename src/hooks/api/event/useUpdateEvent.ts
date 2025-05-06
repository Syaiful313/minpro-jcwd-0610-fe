import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface UpdateEventPayload {
  name?: string;
  description?: string;
  category?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  tickets?: string;
  vouchers?: string;
  thumbnail?: File | null;
}

const useUpdateEvent = (id: number) => {
  const router = useRouter();
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateEventPayload) => {
      const updateEventForm = new FormData();

      if (payload.name) updateEventForm.append("name", payload.name);
      if (payload.description)
        updateEventForm.append("description", payload.description);
      if (payload.category)
        updateEventForm.append("category", payload.category);
      if (payload.location)
        updateEventForm.append("location", payload.location);
      if (payload.startDate)
        updateEventForm.append("startDate", payload.startDate);
      if (payload.endDate) updateEventForm.append("endDate", payload.endDate);
      if (payload.tickets) updateEventForm.append("tickets", payload.tickets);
      if (payload.vouchers)
        updateEventForm.append("vouchers", payload.vouchers);

      if (payload.thumbnail) {
        updateEventForm.append("thumbnail", payload.thumbnail);
      }

      const { data } = await axiosInstance.patch(
        `/events/update/${id}`,
        updateEventForm,
      );
      return data;
    },
    onSuccess: async () => {
      toast.success("Event updated successfully");

      await queryClient.invalidateQueries({ queryKey: ["events"] });
      await queryClient.invalidateQueries({
        queryKey: ["event", "detail", id],
      });

      router.replace("/dashboard/events");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message || "Failed to update event");
    },
  });
};

export default useUpdateEvent;

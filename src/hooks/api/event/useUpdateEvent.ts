"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Ticket {
  id?: string;
  name: string;
  price: string;
  quantity: string;
}

interface Voucher {
  id?: string;
  code: string;
  discount: string;
  startDate: string;
  endDate: string;
}

interface UpdateEventPayload {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
  tickets: Ticket[];
  vouchers: Voucher[];
  thumbnail?: File;
  currentThumbnail?: string;
}

const useUpdateEvent = (id: string) => {
  const router = useRouter();
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: UpdateEventPayload) => {
      const updateEventForm = new FormData();

      // Tambahkan data utama event
      updateEventForm.append("id", id);
      updateEventForm.append("name", payload.name);
      updateEventForm.append("description", payload.description);
      updateEventForm.append("category", payload.category);
      updateEventForm.append("location", payload.location);
      updateEventForm.append("startDate", payload.startDate);
      updateEventForm.append("endDate", payload.endDate);
      
      // Tambahkan data tiket yang diubah menjadi JSON string
      updateEventForm.append("tickets", JSON.stringify(payload.tickets));
      
      // Tambahkan data voucher yang diubah menjadi JSON string
      updateEventForm.append("vouchers", JSON.stringify(payload.vouchers));
      
      // Tambahkan thumbnail jika ada
      if (payload.thumbnail) {
        updateEventForm.append("thumbnail", payload.thumbnail);
      }
      
      // Tambahkan URL thumbnail saat ini jika tersedia
      if (payload.currentThumbnail) {
        updateEventForm.append("currentThumbnail", payload.currentThumbnail);
      }

      const { data } = await axiosInstance.patch(
        `/events/${id}`,
        updateEventForm,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    },
    onSuccess: async () => {
      toast.success("Event berhasil diperbarui");
      await queryClient.invalidateQueries({ 
        queryKey: ["events"] 
      });
      await queryClient.invalidateQueries({ 
        queryKey: ["event", id] 
      });
      router.push("/dashboard/events");
    },
    onError: (error: AxiosError<any>) => {
      const errorMessage = error.response?.data?.message || 
                           error.response?.data || 
                           "Terjadi kesalahan saat memperbarui event";
      toast.error(errorMessage);
    },
  });
};

export default useUpdateEvent;
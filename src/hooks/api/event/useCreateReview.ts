"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Payload untuk review
export interface CreateReviewPayload {
  eventId: number;
  rating: number;
  review?: string; // ulasan opsional
}

const useCreateReview = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { axiosInstance } = useAxios();

  return useMutation({
    mutationFn: async (payload: CreateReviewPayload) => {
      const response = await axiosInstance.post("/events/createreview", payload);
      useQueryClient
      return response.data;
    },
    onSuccess:  () => {
      toast.success("Ulasan berhasil dikirim!");
      queryClient.invalidateQueries({ queryKey: ["event-reviews", "transactions"] });
      
        router.push('/')
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Gagal mengirim ulasan. Silakan coba lagi.";
      toast.error(errorMessage);
    },
  });
};

export default useCreateReview;
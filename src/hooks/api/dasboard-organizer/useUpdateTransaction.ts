"use client";
import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UpdateTransactionPayload {
  transactionId: number;
  isAccepted?: boolean;
  isRejected?: boolean;
}

const useUpdateTransaction = () => {
  const router = useRouter();
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateTransactionPayload) => {
      try {
        const { data } = await axiosInstance.patch(
          "/organizer/events/update",
          payload,
        );
        return data;
      } catch (error) {
        console.error("Error in mutation function:", error);
        throw error;
      }
    },
    onSuccess: async (data) => {
      const successMessage = data.message || "Transaksi berhasil diperbarui";
      toast.success(successMessage);
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
      router.refresh();
    },
    onError: (error: AxiosError<any>) => {
      let errorMessage = "Terjadi kesalahan saat memperbarui status transaksi";

      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          `Error ${error.response.status}: ${error.response.statusText}`;
        console.error("Server error:", error.response.data);
      } else if (error.request) {
        errorMessage = "Server tidak merespons. Silakan coba lagi nanti.";
        console.error("No response from server:", error.request);
      } else {
        errorMessage = error.message || errorMessage;
        console.error("Error message:", error.message);
      }

      toast.error(errorMessage);
    },
  });
};

export default useUpdateTransaction;

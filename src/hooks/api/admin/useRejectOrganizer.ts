"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface RejectOrganizerPayload {
  userIdTarget: number;
}

const useRejectOrganizer = () => {
  const router = useRouter();
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: RejectOrganizerPayload) => {
      const { data } = await axiosInstance.post("/admin/reject", payload);
      return data;
    },
    onSuccess: async (data) => {
      toast.success(data.message || "Permohonan organizer berhasil ditolak");

      await queryClient.invalidateQueries({ queryKey: ["pending-organizers"] });
      await queryClient.invalidateQueries({ queryKey: ["user-lists"] });
      router.refresh();
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data.message ||
          "Terjadi kesalahan saat menolak permohonan",
      );
    },
  });
};

export default useRejectOrganizer;

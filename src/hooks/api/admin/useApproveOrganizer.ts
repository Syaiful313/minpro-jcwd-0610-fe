"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface ApproveOrganizerPayload {
  userIdTarget: number;
}

const useApproveOrganizer = () => {
  const router = useRouter();
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ApproveOrganizerPayload) => {
      console.log("Payload for approve:", payload);
      const { data } = await axiosInstance.post("/admin/approve", payload);
      return data;
    },
    onSuccess: async (data) => {
      toast.success(data.message || "Permohonan organizer berhasil disetujui");

      await queryClient.invalidateQueries({ queryKey: ["pending-organizers"] });
      await queryClient.invalidateQueries({ queryKey: ["user-lists"] });
      router.refresh();
    },
    onError: (error: AxiosError<any>) => {
      console.error("Error approving organizer:", error);
      toast.error(
        error.response?.data.message ||
          "Terjadi kesalahan saat menyetujui permohonan",
      );
    },
  });
};

export default useApproveOrganizer;

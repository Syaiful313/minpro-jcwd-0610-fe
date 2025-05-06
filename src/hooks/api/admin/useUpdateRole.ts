"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface UpdateRolePayload {
  userIdTarget: number;
}

const useUpdateRole = () => {
  const router = useRouter();
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateRolePayload) => {
      const { data } = await axiosInstance.patch("/admin/user-lists", payload);
      return data;
    },
    onSuccess: async (data) => {
      toast.success("Update role success");
      await queryClient.invalidateQueries({ queryKey: ["user-lists"] });
      router.refresh();
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message || error.response?.data);
    },
  });
};

export default useUpdateRole;

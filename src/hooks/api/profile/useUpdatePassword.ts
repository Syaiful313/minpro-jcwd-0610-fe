"use client";
import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
}

interface UpdatePasswordResponse {
  status: string;
  message: string;
}

const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async (passwordData: PasswordUpdateData) => {
      const { data } = await axiosInstance.patch<UpdatePasswordResponse>(
        "/profiles/password",
        passwordData,
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Password updated successfully");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message || error.response?.data);
    },
  });
};

export default useUpdatePassword;

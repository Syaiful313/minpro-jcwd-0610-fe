"use client";
import { User } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useAxios from "@/hooks/useAxios";

interface ProfileUpdateData {
  fullName?: string;
  bio?: string;
  profilePictureFile?: File | null;
}

interface UpdateProfileResponse {
  status: string;
  message: string;
  data: User;
}

const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { axiosInstance } = useAxios();

  return useMutation({
    mutationFn: async (updateData: ProfileUpdateData) => {
      const { profilePictureFile, ...textData } = updateData;

      if (profilePictureFile) {
        const formData = new FormData();

        if (textData.fullName) formData.append("fullName", textData.fullName);
        if (textData.bio) formData.append("bio", textData.bio);
        formData.append("profilePicture", profilePictureFile);

        const { data } = await axiosInstance.patch<UpdateProfileResponse>(
          "/profiles",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        return data;
      } else {
        const { data } = await axiosInstance.patch<UpdateProfileResponse>(
          "/profiles",
          textData,
        );

        return data;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast.success(data.message || "Profile updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    },
  });
};

export default useUpdateProfile;

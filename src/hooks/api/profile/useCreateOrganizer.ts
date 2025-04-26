"use client";

import useAxios from "@/hooks/useAxios";
import { Organizer } from "@/types/organizer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useCreateOrganizer = () => {
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: Organizer) => {
      const createOrganizerForm = new FormData();

      createOrganizerForm.append("companyName", payload.companyName);
      createOrganizerForm.append("companyWebsite", payload.companyWebsite);
      createOrganizerForm.append("companyAddress", payload.companyAddress);
      createOrganizerForm.append("details", payload.details);
      createOrganizerForm.append("npwp", payload.npwp!);

      const { data } = await axiosInstance.post(
        "/profiles/applay-organizer",
        createOrganizerForm,
      );
      return data;
    },
    onSuccess: async () => {
      toast.success("Your application has been sent");
      await queryClient.invalidateQueries({ queryKey: ["profiles"] });
      router.refresh();
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message || error.response?.data);
    },
  });
};

export default useCreateOrganizer;

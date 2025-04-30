"use client";
import useAxios from "@/hooks/useAxios";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

const useGetProfile = (token: string) => {
  const { axiosInstance } = useAxios();
  return useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<User>("/profiles");
      return data;
    },
    enabled: !!token,
  });
};

export default useGetProfile;

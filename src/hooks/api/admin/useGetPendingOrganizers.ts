"use client";

import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface PendingOrganizersParams {
  page?: number;
  take?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

const useGetPendingOrganizers = (initialParams?: PendingOrganizersParams) => {
  const { axiosInstance } = useAxios();
  const [params, setParams] = useState<PendingOrganizersParams>({
    page: initialParams?.page || 1,
    take: initialParams?.take || 10,
    search: initialParams?.search || "",
    sortBy: initialParams?.sortBy || "createdAt",
    sortOrder: initialParams?.sortOrder || "desc",
  });

  const fetchPendingOrganizers = async () => {
    const { data } = await axiosInstance.get("/admin/organizers/pending", {
      params: params,
    });
    return data;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["pending-organizers", params],
    queryFn: fetchPendingOrganizers,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  const updateParams = (newParams: Partial<PendingOrganizersParams>) => {
    setParams((prev) => ({
      ...prev,
      ...newParams,

      page: newParams.search !== undefined ? 1 : newParams.page || prev.page,
    }));
  };

  return {
    pendingOrganizers: data?.data || [],
    meta: data?.meta || {
      page: 1,
      take: 10,
      totalCount: 0,
      totalPages: 0,
    },
    isLoading,
    isError,
    error,
    refetch,
    params,
    updateParams,
  };
};

export default useGetPendingOrganizers;

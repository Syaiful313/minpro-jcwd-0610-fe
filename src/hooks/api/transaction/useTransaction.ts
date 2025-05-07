"use client";

import useAxios from "@/hooks/useAxios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";

interface TransactionPayload {
  details: {
    ticketTypeId: number;
    quantity: number;
  }[];
  voucherCode?: string;
  couponCode?: string;
  usePoints?: boolean;
}

export default function useTransaction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { axiosInstance } = useAxios(); // ✅ Gunakan useAxios seperti useCreateEvent
  const router = useRouter();

  const createTransaction = async (payload: TransactionPayload): Promise<number | null> => {
    setLoading(true);
    setError(null);

    try {
      // Kirim request ke backend
      const res = await axiosInstance.post("/transactions/create", payload);

      if (res.status !== 200) {
        throw new Error("Gagal membuat transaksi");
      }

      // Kembalikan ID transaksi untuk redirect
      return res.data.data.id;
    } catch (err: any) {
      console.error("Checkout gagal:", err);

      // Tangani error dari API
      const errorMessage =
        err.response?.data?.message || "Terjadi kesalahan saat checkout.";

      if (err.response?.status === 401) {
        toast.error("Anda harus login untuk melakukan transaksi.");
      } else {
        toast.error(errorMessage);
      }

      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createTransaction, loading, error };
}
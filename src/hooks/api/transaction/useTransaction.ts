import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const createTransaction = async (payload: TransactionPayload) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/transaction/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gagal membuat transaksi");
      }

      const result = await res.json();
      router.push("/transactions/create"); // Ganti dengan path tujuanmu
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return { createTransaction, loading, error };
}
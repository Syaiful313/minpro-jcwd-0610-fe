import useAxios from "@/hooks/useAxios";
import { useEffect, useState } from "react";

export default function useGetTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { axiosInstance } = useAxios();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axiosInstance.get("/transactions");
        setTransactions(res.data);
      } catch (err: any) {
        setError(err.message || "Gagal memuat riwayat transaksi");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return { transactions, loading, error };
}
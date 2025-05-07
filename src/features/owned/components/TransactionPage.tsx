"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useGetTransactions from "@/hooks/api/transaction/useGetTransaction";
import TicketCard from "@/components/TicketCard";


export default function MyTicketsPage() {
  const { transactions, loading, error } = useGetTransactions();

  if (loading) {
    return <div className="p-6">Memuat tiket...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  // Filter transaksi DONE untuk QR Code
  const doneTransactions = transactions.filter(
    (tx) => tx.status === "DONE"
  );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Tiket Saya</h1>

      {doneTransactions.length === 0 ? (
        <p>Belum ada tiket yang tersedia.</p>
      ) : (
        <div className="space-y-4">
          {doneTransactions.map((tx) => (
            <TicketCard key={tx.id} transaction={tx} />
          ))}
        </div>
      )}

      <div className="mt-6">
        <Link href="/transactions" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Lihat Riwayat Transaksi
        </Link>
      </div>
    </div>
  );
}
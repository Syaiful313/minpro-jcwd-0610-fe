"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import UploadPaymentProof from "./UploadPaymentProof";
import { formatCurrency } from "@/lib/utils";
import axios from "axios";
import  useAxios  from "@/hooks/useAxios";
import CountdownTimer from "./CountdownTimer";

interface TicketType {
  id: number;
  name: string;
  price: number;
}

interface TransactionDetail {
  id: number;
  transactionId: number;
  ticketTypeId: number;
  quantity: number;
  ticketType: TicketType;
}

interface TransactionResponse {
  id: number;
  totalPrice: number;
  userId: number;
  eventId: number;
  usedPoint: boolean;
  pointAmount: number;
  usedVoucherCode: string | null;
  paymentProofUrl: string | null;
  status:
    | "WAITING_FOR_PAYMENT"
    | "WAITING_FOR_ADMIN_CONFIRMATION"
    | "DONE"
    | "REJECTED"
    | "EXPIRED"
    | "CANCELED";
  expiredAt: string;
  createdAt: string;
  transactionsDetails: TransactionDetail[];
}

export default function TransactionPage() {
  const params = useParams();
  const [transaction, setTransaction] = useState<TransactionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { axiosInstance } = useAxios();
  
  const bankAccount = {
    name: "PT. Eventify",
    bca: "1234567890",
    bni: "0987654321",
    mandiri: "5678901234",
  };

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        // ✅ Gunakan axiosInstance dari lib
        const response = await axiosInstance.get(`/transactions/${params.id}`);
        console.log(response);
        
        // Simpan data transaksi ke state
        setTransaction(response.data);
      } catch (err: any) {
        console.error("Gagal mengambil data transaksi:", err);

        if (err.response?.status === 404) {
          setError("Transaksi tidak ditemukan");
        } else {
          setError("Terjadi kesalahan saat memuat transaksi");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [params.id]);

  if (loading) {
    return <div className="p-6">Memuat transaksi...</div>;
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-100 p-6 text-center text-red-700">
        <h2 className="text-lg font-semibold">Error</h2>
        <p>{error}</p>
        <Link href="/transactions" className="mt-4 inline-block text-blue-600 underline">
          Kembali ke Riwayat Transaksi
        </Link>
      </div>
    );
  }

  if (!transaction) {
    return <div className="p-6">Transaksi tidak ditemukan</div>;
  }

  return (
    <div className="mx-auto max-w-xl p-6 space-y-6">
      <h1 className="mb-4 text-2xl font-bold">Berhasil Membuat Transaksi!</h1>
      <div className="rounded-lg border p-4 shadow-sm space-y-4">
        <div>
          <p className="font-medium">ID Transaksi: #{transaction.id}</p>
          <p className="text-sm text-gray-500">
            {new Date(transaction.createdAt).toLocaleDateString()}
          </p>
        </div>

        <hr />

        <div>
          <h2 className="mb-2 font-semibold">Tiket yang Dibeli</h2>
          <ul className="space-y-2">
            {transaction.transactionsDetails.map((detail) => (
              <li key={detail.id} className="flex justify-between border-b pb-2">
                <span>{detail.ticketType.name}</span>
                <span>
                  Qty: {detail.quantity} x {formatCurrency(detail.ticketType.price)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <hr />

        <div className="text-right">
          <p className="font-bold">Total: {formatCurrency(transaction.totalPrice)}</p>
        </div>

        {/* Info Bank jika status WAITING_FOR_PAYMENT */}
        {transaction.status === "WAITING_FOR_PAYMENT" && (
          <>
            <hr />
            <div className="mt-4 rounded-md bg-yellow-100 p-3 text-yellow-800">
              <h3 className="font-semibold">Silakan Lakukan Pembayaran ke:</h3>
              <ul className="list-disc ml-5 mt-2">
                <li>BCA: {bankAccount.bca}</li>
                <li>BNI: {bankAccount.bni}</li>
                <li>Mandiri: {bankAccount.mandiri}</li>
              </ul>
              <p className="mt-2 text-sm">
                Anda punya waktu 2 jam untuk upload bukti pembayaran.
              </p>
            </div>

            <CountdownTimer expiredAt={transaction.expiredAt} />

            <div className="mt-4">
              <UploadPaymentProof transactionId={transaction.id} />
            </div>
          </>
        )}

        {/* Status Menunggu Konfirmasi Admin */}
        {transaction.status === "WAITING_FOR_ADMIN_CONFIRMATION" && (
          <div className="mt-4 rounded-md bg-blue-100 p-3 text-blue-800">
            Menunggu konfirmasi admin...
          </div>
        )}

        {/* Status DONE */}
        {transaction.status === "DONE" && (
          <div className="mt-4 rounded-md bg-green-100 p-3 text-green-800">
            Pembayaran berhasil! Tiket sudah tersedia.
          </div>
        )}

        {/* Status REJECTED */}
        {transaction.status === "REJECTED" && (
          <div className="mt-4 rounded-md bg-red-100 p-3 text-red-800">
            Pembayaran ditolak oleh admin. Silakan coba ulang atau hubungi support.<br/>
            081234566789
          </div>
        )}

        {/* Status EXPIRED */}
        {transaction.status === "EXPIRED" && (
          <div className="mt-4 rounded-md bg-gray-100 p-3 text-gray-800">
            Transaksi kadaluarsa karena tidak ada aktivitas selama 2 jam terakhir.
          </div>
        )}

        {/* Status CANCELED */}
        
      </div>

      <div className="mt-6 flex justify-center">
        <Link
          href="/owned"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Lihat Riwayat Transaksi
        </Link>
      </div>
    </div>
  );
}
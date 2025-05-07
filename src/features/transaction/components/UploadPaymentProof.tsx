"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios"; // Sudah otomatis bawa token via useAxios
import { toast } from "react-toastify";

interface UploadPaymentProofProps {
  transactionId: number;
}

export default function UploadPaymentProof({ transactionId }: UploadPaymentProofProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Pilih file bukti transfer");
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("paymentProof", file);

    try {
      // ✅ Ganti fetch dengan axiosInstance yang sudah bawa token
      const res = await axiosInstance.post(
        `/transactions/upload-proof/${transactionId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      router.refresh(); // Ini akan reload data dari server

      toast.success("Bukti pembayaran berhasil diupload!");
    } catch (err: any) {
      console.error("Upload gagal:", err);

      // Tampilkan pesan error
      const errorMessage =
        err.response?.data?.message || "Gagal upload bukti pembayaran";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit}>
        <label className="block text-sm font-medium mb-1">Upload Bukti Transfer</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
          type="submit"
          disabled={uploading}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {uploading ? "Memproses..." : "Upload Bukti"}
        </button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
}
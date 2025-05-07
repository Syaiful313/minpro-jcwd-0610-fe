"use client";

import { useState, useRef } from "react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { formatCurrency } from "@/lib/utils";

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

interface TransactionProps {
  transaction: {
    id: number;
    totalPrice: number;
    createdAt: string;
    status: string;
    transactionsDetails: TransactionDetail[];
  };
}

export default function TicketCard({ transaction }: TransactionProps) {
  const [downloadLoading, setDownloadLoading] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null); // Untuk capture QR Code

  const downloadTicketAsPDF = () => {
    setDownloadLoading(true);

    const node = qrRef.current;

    if (!node) {
      alert("QR Code belum siap");
      setDownloadLoading(false);
      return;
    }

    html2canvas(node).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF();
      pdf.text("Tiket Anda", 20, 20);
      pdf.addImage(imgData, "PNG", 20, 30, 50, 50);
      pdf.save(`tiket-transaksi-${transaction.id}.pdf`);
      setDownloadLoading(false);
    });
  };

  return (
    <div className="space-y-4 rounded-lg border p-4 shadow-sm">
      <h2 className="font-semibold">Transaksi #{transaction.id}</h2>

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

      <div className="font-bold">
        Total: {formatCurrency(transaction.totalPrice)}
      </div>

      {/* QR Code hanya muncul kalau status DONE */}
      {transaction.status === "DONE" && (
        <>
          {transaction.status === "DONE" && (
            <div ref={qrRef} className="mx-auto mt-4 w-fit bg-white p-4">
              <QRCode
                value={`https://eventify.com/tickets/${transaction.id}`}
                size={128}
              />
            </div>
          )}

         
        </>
      )}
    </div>
  );
}

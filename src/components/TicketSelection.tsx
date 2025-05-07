"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

import { formatCurrency } from "@/lib/utils";
import useTransaction from "@/hooks/api/transaction/useTransaction";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";

interface Ticket {
  id: number;
  type: string;
  price: number;
  totalSeat: number;
}

interface TicketSelectionProps {
  tickets: Ticket[];
}

export function TicketSelection({ tickets }: TicketSelectionProps) {
  const [selectedTickets, setSelectedTickets] = useState<Record<number, number>>({});
  const [usePoints, setUsePoints] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [couponCode, setCouponCode] = useState("");

  const userPoints = 20000;

  const router = useRouter();

  // Hitung total harga tiket
  const totalAmount = Object.entries(selectedTickets).reduce((total, [id, quantity]) => {
    const ticket = tickets.find((t) => t.id === Number(id));
    return total + (ticket?.price || 0) * quantity;
  }, 0);

  // Diskon poin
  const pointsDiscount = usePoints ? Math.min(userPoints, totalAmount) : 0;
  const finalTotal = totalAmount - pointsDiscount;

  // Gunakan hook useTransaction
  const { createTransaction, loading, error } = useTransaction();

  const handleIncrement = (id: number) => {
    const ticket = tickets.find((t) => t.id === id);
    const currentQuantity = selectedTickets[id] || 0;

    if (ticket && currentQuantity < ticket.totalSeat) {
      setSelectedTickets({
        ...selectedTickets,
        [id]: currentQuantity + 1,
      });
    }
  };

  const handleDecrement = (id: number) => {
    const currentQuantity = selectedTickets[id] || 0;

    if (currentQuantity > 0) {
      setSelectedTickets({
        ...selectedTickets,
        [id]: currentQuantity - 1,
      });
    }
  };

  const handleVoucherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoucherCode(e.target.value);
  };

  const handleCheckout = async () => {
    const details = Object.entries(selectedTickets).map(([id, quantity]) => ({
      ticketTypeId: Number(id),
      quantity,
    }));
    
    try {
      // Gunakan createTransaction dari hook
      const transactionId = await createTransaction({
        details,
        voucherCode,
        couponCode,
        usePoints,
      });
      console.log(details);

      // Redirect ke halaman checkout
      if (transactionId) {
        router.push(`/transaction/checkout/${transactionId}`);
      }
    } catch (err: any) {
      // Tangani error
      if (err.message.includes("401")) {
        toast.error("Anda harus login untuk melakukan transaksi.");
      } else {
        toast.error("Gagal membuat transaksi. Silakan coba lagi.");
      }

      console.error("Checkout gagal:", err);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Pilih Tiket</h3>

      <div className="space-y-2">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="hover:bg-muted/50 flex items-center justify-between rounded-md p-2"
          >
            <div className="space-y-1">
              <p className="font-medium">{ticket.type}</p>
              <p className="text-sm font-medium">
                {formatCurrency(ticket.price)}
              </p>
              <p className="font-medium">Total Seats: {ticket.totalSeat}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleDecrement(ticket.id)}
                disabled={(selectedTickets[ticket.id] || 0) === 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-6 text-center">
                {selectedTickets[ticket.id] || 0}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleIncrement(ticket.id)}
                disabled={(selectedTickets[ticket.id] || 0) >= ticket.totalSeat}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Bagian voucher */}
        <div>
          <Label htmlFor="voucher">Kode Voucher</Label>
          <div className="mt-1.5 flex flex-col gap-2">
            <Input
              value={voucherCode}
              onChange={handleVoucherChange}
              placeholder="Masukkan kode voucher"
            />

            {voucherCode && (
              <p className="text-muted-foreground mt-1 text-sm">
                Voucher akan diverifikasi saat checkout
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Checkbox Poin */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="use-points"
          checked={usePoints}
          onCheckedChange={(checked) => setUsePoints(checked === true)}
        />
        <Label htmlFor="use-points">
          Gunakan poin saya ({formatCurrency(userPoints)})
        </Label>
      </div>

      {/* Ringkasan Harga */}
      <Separator />
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(totalAmount)}</span>
        </div>
        {usePoints && pointsDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Diskon poin</span>
            <span>-{formatCurrency(pointsDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{formatCurrency(finalTotal)}</span>
        </div>
      </div>

      {/* Tombol Checkout */}
      <Button className="mt-6 w-full" onClick={handleCheckout} disabled={loading}>
        {loading ? "Memproses..." : "Checkout"}
      </Button>

      {/* Tampilkan Error jika ada */}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
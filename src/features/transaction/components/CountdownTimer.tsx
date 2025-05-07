"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface CountdownTimerProps {
  expiredAt: string;
}

export default function CountdownTimer({ expiredAt }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const now = new Date();
    const expiryDate = new Date(expiredAt);

    if (expiryDate <= now) {
      setIsExpired(true);
      return;
    }

    const updateTime = () => {
      const now = new Date();
      const diff = expiryDate.getTime() - now.getTime();

      if (diff <= 0) {
        setIsExpired(true);
        return;
      }

      const timeLeftFormatted = formatDistanceToNow(expiryDate, {
        locale: id,
        addSuffix: false,
      });

      setTimeLeft(timeLeftFormatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [expiredAt]);

  if (isExpired) {
    return (
      <p className="text-sm text-red-500">
        Waktu upload bukti pembayaran telah habis.
      </p>
    );
  }

  return (
    <p className="text-sm text-green-600">
      Anda punya waktu <strong>{timeLeft}</strong> untuk upload bukti pembayaran.
    </p>
  );
}
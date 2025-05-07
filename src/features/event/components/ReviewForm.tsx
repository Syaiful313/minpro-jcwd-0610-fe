"use client";

import useCreateReview from "@/hooks/api/event/useCreateReview";
import { useState } from "react";
import { toast } from "react-toastify";

interface ReviewFormProps {
  eventId: number;
}

export default function ReviewForm({ eventId }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");

  const createReview = useCreateReview();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Silakan beri rating terlebih dahulu");
      return;
    }

    createReview.mutate({
      eventId,
      rating,
      review: reviewText,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <h2 className="text-lg font-semibold mb-4">Beri Ulasan</h2>

      {/* Rating */}
      <div className="mb-4">
        <label htmlFor="rating" className="block text-sm font-medium mb-1">
          Rating (1-5)
        </label>
        <input
          type="number"
          id="rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          min={1}
          max={5}
          required
          className="w-full border rounded-md p-2"
        />
      </div>

      {/* Text Review */}
      <div className="mb-4">
        <label htmlFor="review" className="block text-sm font-medium mb-1">
          Tuliskan ulasan Anda
        </label>
        <textarea
          id="review"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={4}
          className="w-full border rounded-md p-2"
          placeholder="Bagaimana pengalaman Anda mengikuti acara ini?"
        ></textarea>
      </div>

      {/* Tombol Submit */}
      <button
        type="submit"
        disabled={createReview.isPending}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
      >
        {createReview.isPending ? "Memproses..." : "Kirim Ulasan"}
      </button>
    </form>
  );
}
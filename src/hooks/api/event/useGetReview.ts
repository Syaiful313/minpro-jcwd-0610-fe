"use client";


import useAxios from "@/hooks/useAxios";
import { useEffect, useState } from "react";

interface Review {
  id: number;
  userId: number;
  eventId: number;
  rating: number;
  review: string | null;
  createdAt: string;
  user: {
    fullName: string;
    profilePicture: string | null;
  };
}

export default function useGetReviewsByEvent(eventId: number | null) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { axiosInstance } = useAxios();
  useEffect(() => {
    if (!eventId) return;

    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.get(`events/reviews/${eventId}`);
        setReviews(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Gagal memuat review");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [eventId]);

  return { reviews, loading, error };
}
"use client";

import useGetReviewsByEvent from "@/hooks/api/event/useGetReview";


interface EventReviewListProps {
  eventId: number;
}

export default function EventReviewList({ eventId }: EventReviewListProps) {
  const { reviews, loading, error } = useGetReviewsByEvent(eventId);

  if (loading) {
    return <p>Memuat review...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!reviews || reviews.length === 0) {
    return <p className="text-gray-500">Belum ada review untuk event ini</p>;
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-4">
          <div className="flex items-center gap-2 mb-2">
            {/* Profile Picture */}
            {review.user.profilePicture ? (
              <img
                src={review.user.profilePicture}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                {review.user.fullName.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-medium">{review.user.fullName}</p>
              <div className="flex items-center gap-1 text-yellow-500">
                {"⭐".repeat(review.rating)}
              </div>
            </div>
          </div>

          {/* Ulasan Text */}
          {review.review && <p className="text-gray-700 mt-2">{review.review}</p>}
        </div>
      ))}
    </div>
  );
}
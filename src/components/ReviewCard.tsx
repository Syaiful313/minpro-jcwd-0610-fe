import Image from "next/image"
import { Star } from "lucide-react"

interface ReviewCardProps {
  review: {
    id: string
    user: {
      name: string
      avatar: string
    }
    rating: number
    date: string
    comment: string
  }
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="space-y-2 rounded-lg p-4 transition-colors hover:bg-muted/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src={review.user.avatar || "/placeholder.svg"}
            alt={review.user.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="font-medium">{review.user.name}</p>
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < review.rating ? "fill-amber-500 text-amber-500" : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-xs text-muted-foreground">{review.date}</span>
            </div>
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{review.comment}</p>
    </div>
  )
}

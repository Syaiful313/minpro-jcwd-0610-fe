import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin } from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

interface EventCardProps {
  id: string
  title: string
  date: string
  location: string
  price: number
  image: string
  category: string
}

export default function EventCard({ id, title, date, location, price, image, category }: EventCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link href={`/events/${id}`}>
        <div className="aspect-video w-full overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            width={300}
            height={200}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <Badge className="mb-2">{category}</Badge>
          <h3 className="line-clamp-1 text-xl font-bold">{title}</h3>
          <div className="mt-2 flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-4 w-4" />
            <span>{date}</span>
          </div>
          <div className="mt-1 flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4" />
            <span>{location}</span>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t p-4">
          <div className="font-medium">
            {price === 0 ? <span className="text-green-600">Free</span> : <span>{formatCurrency(price)}</span>}
          </div>
          <Badge variant="outline">View Details</Badge>
        </CardFooter>
      </Link>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { mockEvents } from "@/lib/mock-data"

interface EventListProps {
  filter?: string
}

export default function EventList({ filter }: EventListProps) {
  const [events, setEvents] = useState(mockEvents)

  useEffect(() => {
    // In a real app, this would fetch from an API with the filter applied
    if (filter) {
      let filteredEvents = [...mockEvents]

      if (filter === "today") {
        const today = new Date().toISOString().split("T")[0]
        filteredEvents = mockEvents.filter((event) => event.startDate.split("T")[0] === today)
      } else if (filter === "weekend") {
        // Logic to filter weekend events
        const now = new Date()
        const friday = new Date(now)
        friday.setDate(now.getDate() + (5 - now.getDay()))
        const sunday = new Date(friday)
        sunday.setDate(friday.getDate() + 2)

        filteredEvents = mockEvents.filter((event) => {
          const eventDate = new Date(event.startDate)
          return eventDate >= friday && eventDate <= sunday
        })
      } else if (filter === "free") {
        filteredEvents = mockEvents.filter((event) => event.price === 0)
      } else {
        // Filter by category
        filteredEvents = mockEvents.filter((event) => event.category.toLowerCase() === filter.toLowerCase())
      }

      setEvents(filteredEvents)
    } else {
      setEvents(mockEvents)
    }
  }, [filter])

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No events found</h3>
        <p className="text-muted-foreground">Try changing your filters or check back later</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Link href={`/browsers/${event.id}`} key={event.id}>
          <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-48 w-full">
              <Image
                src={event.image || "/placeholder.svg?height=200&width=400"}
                alt={event.name}
                fill
                className="object-cover"
              />
              {event.price === 0 ? (
                <Badge className="absolute top-2 right-2 bg-green-500">Free</Badge>
              ) : (
                <Badge className="absolute top-2 right-2">{formatCurrency(event.price)}</Badge>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg line-clamp-1">{event.name}</h3>
              <div className="flex items-center text-muted-foreground mt-2">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-sm">{formatDate(event.startDate)}</span>
              </div>
              <div className="flex items-center text-muted-foreground mt-1">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  {new Date(event.startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <div className="flex items-center text-muted-foreground mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm line-clamp-1">{event.location}</span>
              </div>
              <p className="mt-2 text-sm line-clamp-2">{event.description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Badge variant="outline">{event.category}</Badge>
              <span className="text-sm">{event.availableSeats} seats left</span>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}

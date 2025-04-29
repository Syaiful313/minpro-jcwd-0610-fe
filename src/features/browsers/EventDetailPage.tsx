import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, MapPin, Star, Users, Tag, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import ReviewCard from "@/components/ReviewCard"
import { TicketSelection } from "@/components/TicketSelection"

// This would normally come from a database
const event = {
  id: "1",
  title: "Tech Conference 2025",
  description:
    "Join us for the biggest tech conference in Indonesia. Learn from industry experts, network with professionals, and discover the latest trends in technology. This two-day event features workshops, panel discussions, and keynote speeches from leading tech innovators.",
  longDescription:
    "The Tech Conference 2025 is the premier technology event in Indonesia, bringing together the brightest minds and innovative companies in the tech industry. Over two days, attendees will have the opportunity to participate in hands-on workshops, engage in thought-provoking panel discussions, and listen to inspiring keynote speeches from industry leaders.\n\nTopics covered will include artificial intelligence, blockchain technology, cybersecurity, cloud computing, and emerging tech trends. Whether you're a developer, entrepreneur, or tech enthusiast, this conference offers valuable insights and networking opportunities to help you stay ahead in the rapidly evolving tech landscape.\n\nThe event will feature dedicated spaces for networking, product demonstrations, and career opportunities with leading tech companies. Don't miss this chance to be part of Indonesia's most anticipated tech gathering of 2025!",
  date: "April 20-21, 2025",
  time: "08:00 - 17:00",
  location: "Jakarta Convention Center",
  address: "Jl. Gatot Subroto No.1, Jakarta Pusat",
  organizer: {
    id: "org1",
    name: "TechEvents Indonesia",
    logo: "/placeholder.svg?height=50&width=50",
    rating: 4.8,
    eventCount: 24,
  },
  price: 300000,
  availableSeats: 250,
  category: "Technology",
  image: "/placeholder.svg?height=500&width=1000",
  ticketTypes: [
    {
      id: "1",
      name: "Regular",
      price: 300000,
      description: "Access to all sessions and workshops",
      availableSeats: 150,
    },
    {
      id: "2",
      name: "VIP",
      price: 500000,
      description: "Regular benefits plus exclusive networking dinner and premium seating",
      availableSeats: 50,
    },
    {
      id: "3",
      name: "Student",
      price: 150000,
      description: "Valid student ID required at check-in",
      availableSeats: 50,
    },
  ],
  reviews: [
    {
      id: "1",
      user: {
        name: "Budi Santoso",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      rating: 5,
      date: "May 1, 2024",
      comment:
        "Amazing conference! The speakers were world-class and I learned so much about AI and blockchain. Will definitely attend next year.",
    },
    {
      id: "2",
      user: {
        name: "Siti Rahayu",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      rating: 4,
      date: "April 30, 2024",
      comment:
        "Great event with excellent networking opportunities. The workshops were very informative, though some sessions were a bit crowded.",
    },
  ],
}

export default function EventPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-6 md:px-6 md:py-8">
        <Link
          href="/browsers"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Events
        </Link>

        <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-lg">
              <Image
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                width={1000}
                height={500}
                className="w-full object-cover"
              />
            </div>

            <div className="mt-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{event.category}</Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-1 h-4 w-4" />
                  <span>{event.availableSeats} seats available</span>
                </div>
              </div>

              <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{event.title}</h1>

              <div className="mt-4 flex flex-col gap-2 text-muted-foreground sm:flex-row sm:gap-6">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  <span>{event.location}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center">
                <div className="flex items-center">
                  <Image
                    src={event.organizer.logo || "/placeholder.svg"}
                    alt={event.organizer.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="ml-2">
                    <p className="text-sm font-medium">{event.organizer.name}</p>
                    <div className="flex items-center">
                      <Star className="mr-1 h-3 w-3 fill-amber-500 text-amber-500" />
                      <span className="text-xs">
                        {event.organizer.rating} • {event.organizer.eventCount} events
                      </span>
                    </div>
                  </div>
                </div>
                <Link href={`/organizers/${event.organizer.id}`} className="ml-auto">
                  <Button variant="outline" size="sm">
                    View Organizer
                  </Button>
                </Link>
              </div>

              <Tabs defaultValue="details" className="mt-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="mt-4 space-y-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <p>{event.longDescription}</p>
                  </div>
                </TabsContent>
                <TabsContent value="location" className="mt-4">
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <h3 className="font-medium">{event.location}</h3>
                    <p className="text-sm text-muted-foreground">{event.address}</p>
                    <div className="mt-4 aspect-video w-full overflow-hidden rounded-md bg-muted">
                      <Image
                        src="/placeholder.svg?height=300&width=600"
                        alt="Map"
                        width={600}
                        height={300}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                        <span className="ml-1 font-medium">{event.organizer.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Based on {event.reviews.length} reviews</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    {event.reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="lg:row-start-1">
            <div className="sticky top-20 rounded-lg border bg-card p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Price starts from</p>
                  <p className="text-2xl font-bold">{formatCurrency(event.price)}</p>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Tag className="mr-1 h-4 w-4" />
                  <span>{event.availableSeats} seats left</span>
                </div>
              </div>

              <TicketSelection tickets={event.ticketTypes} />

              <div className="mt-6 space-y-2">
                <Button className="w-full">Buy Tickets</Button>
                <Button variant="outline" className="w-full">
                  Add to Wishlist
                </Button>
              </div>

              <div className="mt-4 rounded-md bg-muted p-3">
                <h4 className="font-medium">Event Policies</h4>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <li>• Tickets are non-refundable</li>
                  <li>• Valid ID required for entry</li>
                  <li>• No recording devices allowed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  Users,
  Tag,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import ReviewCard from "@/components/ReviewCard";
import { TicketSelection } from "@/components/TicketSelection";
import { IEvent } from "@/types/Event";
import useGetEvents from "@/hooks/api/event/useGetEvents";
import { FC } from "react";
import useGetEventBySlug from "@/hooks/api/event/useGetEventBySlug";


interface EventDetail {
  slug: string;
}

const EventDetailPage: FC<EventDetail> = ({ slug }) => {
  const { data: event, isPending } = useGetEventBySlug(slug);

  return (
    <div className="bg-background min-h-screen">
      <div className="container px-4 py-6 md:px-6 md:py-8">
        <Link
          href="/browsers"
          className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center text-sm font-medium"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Events
        </Link>

        <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-lg">
              <Image
                src={event?.thumbnail || "/placeholder.svg"}
                alt={event?.thumbnail || "/placeholder.svg"}
                width={1000}
                height={500}
                className="w-full object-cover"
              />
            </div>

            <div className="mt-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{event?.category}</Badge>
                <div className="text-muted-foreground flex items-center text-sm">
                  <Users className="mr-1 h-4 w-4" />
                  <span>{event?.availableSeats} seats available</span>
                </div>
              </div>

              <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                {event?.name}
              </h1>

              <div className="text-muted-foreground mt-4 flex flex-col gap-2 sm:flex-row sm:gap-6">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  <span>{event?.startDate}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  <span>{event?.startDate}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  <span>{event?.location}</span>
                </div>
              </div>

              {/* <div className="mt-4 flex items-center">
                <div className="flex items-center">
                  <Image
                    src={event.thumbnail || "/placeholder.svg"}
                    alt={event.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="ml-2">
                    <p className="text-sm font-medium">
                      {event.name}
                    </p>
                    <div className="flex items-center">
                      <Star className="mr-1 h-3 w-3 fill-amber-500 text-amber-500" />
                      <span className="text-xs">
                        {event.organizer.rating} • {event.organizer.eventCount}{" "}
                        events
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/organizers/${event.organizer.id}`}
                  className="ml-auto"
                >
                  <Button variant="outline" size="sm">
                    View Organizer
                  </Button>
                </Link>
              </div> */}

              <Tabs defaultValue="details" className="mt-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="mt-4 space-y-4">
                  <div className="prose dark:prose-invert max-w-none">
                    <p>{event?.description}</p>
                  </div>
                </TabsContent>
                <TabsContent value="location" className="mt-4">
                  <div className="bg-muted/50 rounded-lg border p-4">
                    <h3 className="font-medium">{event?.location}</h3>
                    <p className="text-muted-foreground text-sm">
                      {event?.location}
                    </p>
                    <div className="bg-muted mt-4 aspect-video w-full overflow-hidden rounded-md">
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
                {/* <TabsContent value="reviews" className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                        <span className="ml-1 font-medium">
                          {event.organizer.rating}
                        </span>
                      </div>
                      <span className="text-muted-foreground text-sm">
                        Based on {event.reviews.length} reviews
                      </span>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    {event.reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                </TabsContent> */}
              </Tabs>
            </div>
          </div>

          <div className="lg:row-start-1">
            <div className="bg-card sticky top-20 rounded-lg border p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Price starts from
                  </p>
                  <p className="text-2xl font-bold">{event?.price}</p>
                </div>
                <div className="text-muted-foreground flex items-center text-sm">
                  <Tag className="mr-1 h-4 w-4" />
                  <span>{event?.availableSeats} seats left</span>
                </div>
              </div>

              {/* <TicketSelection tickets={event.ticketTypes} /> */}

              <div className="mt-6 space-y-2">
                <Button className="w-full">Buy Tickets</Button>
                <Button variant="outline" className="w-full">
                  Add to Wishlist
                </Button>
              </div>

              <div className="bg-muted mt-4 rounded-md p-3">
                <h4 className="font-medium">Event Policies</h4>
                <ul className="text-muted-foreground mt-2 space-y-1 text-xs">
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
  );
};

export default EventDetailPage;

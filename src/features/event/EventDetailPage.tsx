"use client";

import Markdown from "@/components/MarkDown";
import Navbar from "@/components/Navbar";
import { TicketSelection } from "@/components/TicketSelection";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGetEventBySlug from "@/hooks/api/event/useGetEventBySlug";
import { formatCurrency } from "@/lib/utils";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import { FC, useState } from "react";
import ReviewForm from "./components/ReviewForm";
import EventReviewList from "./components/ReviewList";
import Footer from "@/components/Footer";

interface EventDetail {
  slug: string;
}

const EventDetailPage: FC<EventDetail> = ({ slug }) => {
  const { data: event, isPending, error } = useGetEventBySlug(slug);
  const [canReview, setCanReview] = useState(false);

  if (isPending) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen">Error: {error.message}</div>;
  }

  if (!event || !event.tickets) {
    return <div className="flex justify-center items-center min-h-screen">No event found!</div>;
  }
  
  const tickets =
    event?.tickets.map((ticket) => ({
      id: ticket.id,
      type: ticket.type,
      price: ticket.price,
      totalSeat: ticket.totalSeat,
    })) || [];

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <div className="container px-4 py-4 md:px-6 md:py-20 max-w-7xl mx-auto">
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3 lg:gap-8">
          {/* On mobile: Order summary first, then content */}
          <div className="lg:col-span-2 lg:row-start-1 order-2 lg:order-1">
            <div className="overflow-hidden rounded-lg">
              <Image
                src={event?.thumbnail || "/PlaceHolder.png"}
                alt={event?.name || "Event thumbnail"}
                width={1000}
                height={500}
                className="w-full object-cover aspect-video"
                priority
              />
            </div>

            <div className="mt-4 md:mt-6">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight break-words">
                {event?.name}
              </h1>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge className="text-xs md:text-sm">{event?.category}</Badge>
                <div className="text-muted-foreground flex items-center text-xs md:text-sm">
                  <MapPin className="mr-1 h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                  <span className="line-clamp-1">{event?.location}</span>
                </div>
                <div className="text-muted-foreground flex items-center text-xs md:text-sm">
                  <Calendar className="mr-1 h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                  <span>{event?.startDate}</span>
                </div>
              </div>

              <Tabs defaultValue="details" className="mt-4 md:mt-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-4 space-y-4">
                  <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                    <Markdown content={event?.description || ""} />
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-4">
                  {canReview && <ReviewForm eventId={event.id} />}

                  <section className="mt-4">
                    <h2 className="mb-4 text-xl font-semibold">Visitor Reviews</h2>
                    <EventReviewList eventId={event.id} />
                  </section>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* On mobile: Display this at the top */}
          <div className="order-1 lg:order-2 lg:row-start-1">
            <div className="bg-card rounded-lg border p-4 shadow-sm lg:sticky lg:top-20">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-lg font-medium">Order Summary</h4>
              </div>

              <TicketSelection tickets={tickets} />

              <div className="bg-muted mt-4 rounded-md p-3">
                <h4 className="font-medium text-sm md:text-base">Event Policies</h4>
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
      <Footer/>
    </div>
  );
};

export default EventDetailPage;
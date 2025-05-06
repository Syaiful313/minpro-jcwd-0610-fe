"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TicketSelection } from "@/components/TicketSelection";
import { Event } from "@/types/event"; // Ensure to import Event interface
import useGetEventBySlug from "@/hooks/api/event/useGetEventBySlug";
import { FC } from "react";
import { formatCurrency } from "@/lib/utils"; // Make sure this helper is imported for formatting
import Markdown from "@/components/MarkDown";
import { formatDate } from "date-fns";

interface EventDetail {
  slug: string;
}

const EventDetailPage: FC<EventDetail> = ({ slug }) => {
  const { data: event, isPending, error } = useGetEventBySlug(slug);
  console.log(event);

  // Jika sedang loading, tampilkan loading
  if (isPending) {
    return <div>Loading...</div>;
  }

  // Jika ada error, tampilkan pesan error
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!event || !event.tickets) {
    return <div>No event found!</div>;
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
                src={event?.thumbnail || "/PlaceHolder.png"}
                alt="placeholder"
                width={1000}
                height={500}
                className="w-full object-cover"
              />
            </div>

            <div className="mt-6">
              <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                {event?.name}
              </h1>

              <div className="flex flex-wrap items-center gap-2">
                <Badge>{event?.category}</Badge>
                <div className="text-muted-foreground flex items-center text-sm">
                  <MapPin className="mr-1 h-4 w-4" />
                  <span>{event?.location}</span>
                </div>
                <div className="text-muted-foreground mt-2 flex items-center text-sm">
                  <Calendar className="mr-1 h-4 w-4" />
                </div>
              </div>

              <Tabs defaultValue="details" className="mt-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="tickets">Tickets</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-4 space-y-4">
                  <Markdown content={event?.description || ""} />
                </TabsContent>

                <TabsContent value="tickets" className="mt-4 space-y-4">
                  <h3 className="text-lg font-bold">Ticket Types</h3>
                  {tickets.map((ticket, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b py-2"
                    >
                      <div>
                        <p className="font-medium">{ticket.type}</p>
                        <p className="text-muted-foreground text-sm">
                          {formatCurrency(ticket.price)} per ticket
                        </p>
                      </div>
                      <input
                        type="number"
                        min="1"
                        max={ticket.totalSeat}
                        placeholder="Qty"
                        className="w-16 rounded-md border p-1"
                      />
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="location" className="mt-4">
                  <p>{event?.location}</p>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="lg:row-start-1">
            <div className="bg-card sticky top-20 rounded-lg border p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-lg font-medium">Order Summary</h4>
              </div>

              <TicketSelection tickets={tickets} />

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

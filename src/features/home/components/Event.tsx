
"use client";

import { CategoryFilter } from "@/components/CategoryFilter";
import EventCard from "@/components/EventCard";
import { LocationFilter } from "@/components/LocationFilter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import useGetEvents from "@/hooks/api/event/useGetEvents";
import { Event } from "@/lib/types";
import { IEvent } from "@/types/Event";
import Link from "next/link";
import React from "react";



export default function HeroSectionEvent() {
  const { data } = useGetEvents();

  

  function renderContent(featuredEvents: IEvent []) {
    console.log("EventCard")
    return (
      
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Tabs defaultValue="featured" className="w-full">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Explore Events</h2>
          </div>
          <TabsContent value="featured">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredEvents.length > 0 ? (
                featuredEvents.map((event) => (
                  <EventCard key={event.slug} event={event} />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  No featured events available.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    );
  }

  if (data) {
    const events = data.events || [];

    return renderContent(events);
  }
}

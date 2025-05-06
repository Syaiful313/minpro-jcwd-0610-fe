import React from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventList from "@/components/EventList";
import HeroSectionEvent from "@/features/home/components/Event";

const BrowsersList = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discover Events</h1>
          <p className="text-muted-foreground mt-1">
            Find and book amazing events near you
          </p>
        </div>
        <div className="flex w-full gap-2 md:w-auto">
          <div className="relative w-full md:w-[300px]">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search events..."
              className="w-full pl-8"
            />
          </div>
          
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="weekend">This Weekend</TabsTrigger>
          <TabsTrigger value="free">Free</TabsTrigger>
          <TabsTrigger value="music">Music</TabsTrigger>
          <TabsTrigger value="art">Art & Culture</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <HeroSectionEvent />
        </TabsContent>
        <TabsContent value="today">
          <EventList filter="today" />
        </TabsContent>
        <TabsContent value="weekend">
          <EventList filter="weekend" />
        </TabsContent>
        <TabsContent value="free">
          <EventList filter="free" />
        </TabsContent>
        <TabsContent value="music">
          <EventList filter="music" />
        </TabsContent>
        <TabsContent value="art">
          <EventList filter="art" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrowsersList;

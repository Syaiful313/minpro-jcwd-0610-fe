import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Event } from "@/types/event";
import { format } from "date-fns";
import { FC } from "react";
import Markdown from "./MarkDown";

interface EventCardProps {
  event: Event;
}

const EventCard: FC<EventCardProps> = ({ event }) => {
  const {
    slug,
    name,
    startDate,
    endDate,
    location,
    description,
    thumbnail,
    category,
  } = event;

  const formattedEventStart = format(new Date(startDate), "PPP");
  const formattedEventEnd = format(new Date(endDate), "PPP");

  return (
    <div className="flex gap-4 overflow-x-auto">
      <Card className="overflow-hidden transition-all hover:shadow-md" style={{ width: "300px" }}>
        <Link href={`/events/${slug}`}>
          <div className="aspect-video w-full overflow-hidden">
            <Image
              src={thumbnail || "/placeholder.png"}
              alt={name}
              width={300}
              height={200}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
          <CardContent className="p-4">
            <Badge className="mb-2">{category}</Badge>
            <h3 className="line-clamp-1 text-xl font-bold">{name}</h3>
            <div className="text-muted-foreground mt-2 flex items-center text-sm">
              <Calendar className="mr-1 h-4 w-4" />
              <span>{formattedEventStart}</span>
            </div>
            <div className="text-muted-foreground mt-1 flex items-center text-sm">
              <MapPin className="mr-1 h-4 w-4" />
              <span>{location}</span>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t p-4">
            <div className="flex flex-col">
              <div className="line-clamp-3">
                <Markdown content={description} />
              </div>
              <div className="mt-4">
                <Badge variant="outline">View Details</Badge>
              </div>
            </div>
          </CardFooter>
        </Link>
      </Card>
    </div>
  );
};

export default EventCard;

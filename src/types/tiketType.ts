import { Event } from "./event";

export interface TicketType {
  id: number;
  eventId: number;
  event?: Event;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}
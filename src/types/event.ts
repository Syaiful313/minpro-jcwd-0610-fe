export interface Ticket {
  id: number;
  type: string;
  price: number;
  totalSeat: number;
}

export interface Voucher {
  id: number;
  code: string;
  discount: number;
  startDate: string;
  endDate: string;
}

export interface Event {
  id: number;
  slug: string;
  name: string;
  description: string;
  thumbnail: string;
  startDate: string;
  endDate: string;
  location: string;
  price: number;
  availableSeats: number;
  category: string;
  tickets: Ticket[]; // Updated from tickets to ticket_types
  vouchers: Voucher[]; // Added vouchers
  createdAt: string;
  updatedAt: string;
}

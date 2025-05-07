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
  maxUsage: number;
}

export interface Review {
  id: number;
  rating: number;
  review: string;
}

export interface Transaction {
  id: number;
  userId: number;
  status: string;
}
export interface Event {
  id: number;
  userId: number;
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
  tickets: Ticket[]; 
  vouchers: Voucher[]; 
  createdAt: string;
  updatedAt: string;
  reviews: Review[];
  transactions: Transaction[];
}

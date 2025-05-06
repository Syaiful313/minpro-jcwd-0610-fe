import { User } from "./user";
import { Event } from "./event";
import { TicketType } from "./tiketType";
import { TransactionStatus } from "./enums";

export interface Transaction {
  id: number;
  userId: number;
  user: Pick<User, "id" | "fullName" | "email">;
  eventId: number;
  event: Pick<Event, "id" | "name" | "startDate" | "endDate">;
  ticketTypeId: number | null;
  ticketType: Pick<TicketType, "id" | "name" | "price"> | null;
  quantity: number;
  totalPrice: number;
  usedPoint: boolean;
  pointAmount: number;
  usedVoucherCode: string | null;
  paymentProofUrl: string;
  status: TransactionStatus;
  expiredAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionsResponse {
  data: Transaction[];
  meta: {
    page: number;
    take: number;
    total: number;
    totalPages: number;
  };
}
export interface TransactionData {
  date: string;
  ticketsSold: string;
  revenue: string;
}

export interface TransactionDataResponse {
  data: TransactionData[];
  totalRevenue: number;
  totalTicketsSold: number;
  totalEvents: number;
}

export interface TransactionDetail {
  id: number;
  transactionId: number;
  ticketTypeId: number;
  quantity: number;
  ticketType: {
    id: number;
    name: string;
    price: number;
  };
}
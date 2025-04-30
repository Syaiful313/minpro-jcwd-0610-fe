export interface Event {
  id: number;
  userId: number;
  slug: string;
  name: string;
  imageUrl: string;
  category: string;
  location: string;
  description: string;
  price: number;
  startDate: Date;
  endDate: Date;
  totalSeat: number;
  thumbnail: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

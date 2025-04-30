export interface IEvent {
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
    schedule?: string[];
}
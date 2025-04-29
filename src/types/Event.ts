export interface Event {
    id: string;
    name: string;
    description: string;
    image?: string;
    startDate: string;
    endDate: string;
    location: string;
    price: number;
    availableSeats: number;
    category: string;
    schedule?: string[];
}
export interface Event {
    id: string
    name: string
    description: string
    image?: string
    startDate: string
    endDate: string
    location: string
    price: number
    availableSeats: number
    category: string
    schedule?: string[]
    organizer: Organizer
  }
  
  export interface Organizer {
    id: string
    name: string
    avatar?: string
    description: string
    rating: number
    reviewCount: number
  }
  
  export interface Review {
    id: string
    eventId: string
    userId: string
    userName: string
    userAvatar: string
    rating: number
    comment: string
    date: string
  }
  
  export interface Transaction {
    id: string
    eventId: string
    userId: string
    quantity: number
    totalPrice: number
    pointsUsed: number
    voucherCode?: string
    status: "waiting-for-payment" | "waiting-for-confirmation" | "done" | "rejected" | "expired" | "canceled"
    paymentProof?: string
    createdAt: string
    expiresAt: string
  }
  
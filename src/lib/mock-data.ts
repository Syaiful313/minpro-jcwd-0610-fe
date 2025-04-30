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
  


export const mockEvents: Event[] = [
  {
    id: "event-1",
    name: "Music Festival 2023",
    description:
      "Join us for the biggest music festival of the year featuring top artists from around the world. Experience amazing performances, great food, and unforgettable memories.",
    image: "/placeholder.svg?height=400&width=800",
    startDate: "2023-12-15T18:00:00Z",
    endDate: "2023-12-17T23:00:00Z",
    location: "Central Park, Jakarta",
    price: 350000,
    availableSeats: 500,
    category: "Music",
    schedule: ["Day 1: Rock & Alternative", "Day 2: Pop & Electronic", "Day 3: Hip Hop & R&B"],
    organizer: {
      id: "org-1",
      name: "EventMaster Productions",
      avatar: "/placeholder.svg?height=64&width=64",
      description: "Premier event organizer with over 10 years of experience",
      rating: 4.8,
      reviewCount: 245,
    },
  },
  {
    id: "event-2",
    name: "Tech Conference 2023",
    description:
      "A conference for developers, designers, and tech enthusiasts. Learn about the latest technologies and network with industry professionals.",
    image: "/placeholder.svg?height=400&width=800",
    startDate: "2023-11-20T09:00:00Z",
    endDate: "2023-11-22T17:00:00Z",
    location: "Convention Center, Bandung",
    price: 250000,
    availableSeats: 300,
    category: "Business",
    schedule: ["Day 1: Web Development", "Day 2: Mobile Development", "Day 3: AI & Machine Learning"],
    organizer: {
      id: "org-2",
      name: "TechEvents Indonesia",
      avatar: "/placeholder.svg?height=64&width=64",
      description: "Organizing tech events since 2015",
      rating: 4.6,
      reviewCount: 189,
    },
  },
  {
    id: "event-3",
    name: "Art Exhibition: Modern Perspectives",
    description:
      "Explore contemporary art from Indonesian artists. This exhibition showcases various mediums including paintings, sculptures, and digital art.",
    image: "/placeholder.svg?height=400&width=800",
    startDate: "2023-12-05T10:00:00Z",
    endDate: "2023-12-20T18:00:00Z",
    location: "National Gallery, Jakarta",
    price: 0,
    availableSeats: 1000,
    category: "Art",
    organizer: {
      id: "org-3",
      name: "ArtSpace Indonesia",
      avatar: "/placeholder.svg?height=64&width=64",
      description: "Promoting local artists and cultural events",
      rating: 4.7,
      reviewCount: 156,
    },
  },
  {
    id: "event-4",
    name: "Food Festival: Taste of Indonesia",
    description:
      "Sample delicious dishes from across the Indonesian archipelago. From Padang to Papuan cuisine, experience the rich culinary heritage of Indonesia.",
    image: "/placeholder.svg?height=400&width=800",
    startDate: "2023-11-25T11:00:00Z",
    endDate: "2023-11-26T22:00:00Z",
    location: "Senayan City, Jakarta",
    price: 150000,
    availableSeats: 400,
    category: "Food",
    organizer: {
      id: "org-4",
      name: "Culinary Indonesia",
      avatar: "/placeholder.svg?height=64&width=64",
      description: "Celebrating Indonesia's diverse food culture",
      rating: 4.5,
      reviewCount: 210,
    },
  },
  {
    id: "event-5",
    name: "Yoga & Wellness Retreat",
    description:
      "A weekend of relaxation, meditation, and yoga. Recharge your mind and body in a peaceful environment away from the city.",
    image: "/placeholder.svg?height=400&width=800",
    startDate: "2023-12-08T07:00:00Z",
    endDate: "2023-12-10T16:00:00Z",
    location: "Ubud, Bali",
    price: 500000,
    availableSeats: 50,
    category: "Sports",
    schedule: ["Day 1: Introduction to Meditation", "Day 2: Yoga & Mindfulness", "Day 3: Healthy Living Workshop"],
    organizer: {
      id: "org-5",
      name: "Wellness Indonesia",
      avatar: "/placeholder.svg?height=64&width=64",
      description: "Promoting healthy living and wellness",
      rating: 4.9,
      reviewCount: 98,
    },
  },
  {
    id: "event-6",
    name: "Photography Workshop",
    description:
      "Learn photography techniques from professional photographers. This workshop covers composition, lighting, and post-processing.",
    image: "/placeholder.svg?height=400&width=800",
    startDate: "2023-11-18T13:00:00Z",
    endDate: "2023-11-19T17:00:00Z",
    location: "Creative Hub, Yogyakarta",
    price: 200000,
    availableSeats: 30,
    category: "Education",
    organizer: {
      id: "org-6",
      name: "Creative Workshops ID",
      avatar: "/placeholder.svg?height=64&width=64",
      description: "Hands-on workshops for creative skills",
      rating: 4.7,
      reviewCount: 75,
    },
  },
]

export const mockReviews: Review[] = [
  {
    id: "review-1",
    eventId: "event-1",
    userId: "user-1",
    userName: "Budi Santoso",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment:
      "Amazing festival! The performances were top-notch and the atmosphere was electric. Will definitely attend next year!",
    date: "2023-12-18T14:30:00Z",
  },
  {
    id: "review-2",
    eventId: "event-1",
    userId: "user-2",
    userName: "Siti Rahayu",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    comment:
      "Great event overall. The music was fantastic but the food options were a bit limited. Would recommend bringing more vendors next time.",
    date: "2023-12-18T16:45:00Z",
  },
  {
    id: "review-3",
    eventId: "event-2",
    userId: "user-3",
    userName: "Agus Wijaya",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment:
      "The tech conference was incredibly informative. I learned so much about new technologies and made valuable connections.",
    date: "2023-11-23T10:15:00Z",
  },
  {
    id: "review-4",
    eventId: "event-3",
    userId: "user-4",
    userName: "Maya Putri",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    comment: "Beautiful exhibition with thought-provoking pieces. The venue was a bit crowded though.",
    date: "2023-12-10T13:20:00Z",
  },
  {
    id: "review-5",
    eventId: "event-4",
    userId: "user-5",
    userName: "Dian Kusuma",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment:
      "The food festival was a culinary delight! I got to taste dishes from all over Indonesia. The Rendang was exceptional!",
    date: "2023-11-27T19:10:00Z",
  },
]

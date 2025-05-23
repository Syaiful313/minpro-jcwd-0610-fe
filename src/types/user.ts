import { Organizer } from "./organizer";

export interface User {
  id: number;
  fullName: string;
  email: string;
  password: string;
  role: string;
  bio: string;
  profilePicture: string;
  referralCode: string;
  point: number;
  expirationDate: Date | null | string;
  createdAt: Date;
  updatedAt: Date;
  organizer?: {
    id: number;
    userId: number;
    npwp: string;
    companyName: string;
    companyWebsite: string;
    companyAddress: string;
    details: string;
    acceptedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

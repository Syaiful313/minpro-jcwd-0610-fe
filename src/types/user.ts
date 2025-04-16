export interface User{
    id: number;
    fullName: string;
    email: string;
    password: string;
    role: string;
    bio: string;
    profilePicture: string;
    createdAt: Date;
    updatedAt: Date;
}
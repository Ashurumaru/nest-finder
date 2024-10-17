export interface User  {
    id: string;
    name: string;
    surname?: string | null;
    email: string;
    hashedPassword?: string | null;
    image?: string | null;
    phoneNumber?: string | null;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

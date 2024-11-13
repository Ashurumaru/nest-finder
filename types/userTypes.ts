import {Role} from "@prisma/client";

export interface User  {
    id: string;
    name: string;
    surname?: string | null;
    email: string;
    hashedPassword?: string | null;
    image?: string | null;
    phoneNumber?: string | null;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}

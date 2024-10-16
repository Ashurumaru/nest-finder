import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { User } from '@/types/userTypes';

export async function GET() {
    try {
        const users: User[] = await prisma.user.findMany();

        if (users.length === 0) {
            return NextResponse.json({ message: 'No users found' }, { status: 404 });
        }

        return NextResponse.json(users);
    } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
        return NextResponse.json(
            { message: 'Error fetching users' },
            { status: 500 }
        );
    }
}

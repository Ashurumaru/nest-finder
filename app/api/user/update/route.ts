import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { auth } from "@/auth";

// POST-запрос для обновления данных пользователя
export async function POST(request: Request) {
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name, surname, birthday } = await request.json();

    try {
        // Обновление данных пользователя в базе данных
        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                name,
                surname,
                birthday: birthday ? new Date(birthday) : null,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ message: 'Failed to update profile' }, { status: 500 });
    }
}

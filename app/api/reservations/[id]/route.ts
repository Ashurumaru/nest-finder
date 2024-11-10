// app/api/reservations/[id]/route.ts
import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import prisma from '@/prisma/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const session = await auth();

    if (!session) {
        return NextResponse.json({ message: 'Неавторизован' }, { status: 401 });
    }

    try {
        const reservation = await prisma.reservation.findUnique({
            where: { id },
            include: {
                user: {
                    select: { name: true, email: true },
                },
                post: {
                    select: { title: true, price: true },
                },
            },
        });

        if (!reservation) {
            return NextResponse.json({ message: 'Бронирование не найдено' }, { status: 404 });
        }

        if (reservation.userId !== session.user?.id && session.user?.role !== 'ADMIN') {
            return NextResponse.json({ message: 'Доступ запрещен' }, { status: 403 });
        }

        return NextResponse.json(reservation);
    } catch (error) {
        console.error('Ошибка при получении бронирования:', error);
        return NextResponse.json({ message: 'Ошибка при получении бронирования' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const session = await auth();

    if (!session || !session.user) {
        return NextResponse.json({ message: 'Неавторизован' }, { status: 401 });
    }

    try {
        const reservation = await prisma.reservation.findUnique({
            where: { id },
        });

        if (!reservation) {
            return NextResponse.json({ message: 'Бронирование не найдено' }, { status: 404 });
        }

        if (reservation.userId !== session.user.id && session.user.role !== 'ADMIN') {
            return NextResponse.json({ message: 'Доступ запрещен' }, { status: 403 });
        }

        await prisma.reservation.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Бронирование успешно удалено' });
    } catch (error) {
        console.error('Ошибка при удалении бронирования:', error);
        return NextResponse.json({ message: 'Ошибка при удалении бронирования' }, { status: 500 });
    }
}

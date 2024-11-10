// app/api/reservations/route.ts
import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import prisma from '@/prisma/prisma';
import { startOfDay, endOfDay, isAfter, isBefore, isSameDay } from 'date-fns';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const postId = url.searchParams.get('postId');
    const userId = url.searchParams.get('userId');
    const future = url.searchParams.get('future') === 'true';
    const current = url.searchParams.get('current') === 'true';
    const past = url.searchParams.get('past') === 'true';

    // Проверяем, является ли пользователь администратором
    const session = await auth();
    const isAdmin = session?.user?.role === 'ADMIN';

    try {
        const today = new Date();
        let whereClause: any = {};

        if (postId) whereClause.postId = postId;

        // Если пользователь – администратор, разрешаем использовать фильтр по userId
        if (userId && isAdmin) {
            whereClause.userId = userId;
        } else if (session) {
            // Если пользователь авторизован, фильтруем по userId текущего пользователя
            whereClause.userId = session.user?.id;
        }

        if (future) {
            whereClause.startDate = { gt: today };
        } else if (current) {
            whereClause.startDate = { lte: endOfDay(today) };
            whereClause.endDate = { gte: startOfDay(today) };
        } else if (past) {
            whereClause.endDate = { lt: today };
        }

        const reservations = await prisma.reservation.findMany({
            where: whereClause,
            include: {
                user: {
                    select: { name: true, email: true },
                },
                post: {
                    select: { title: true, price: true },
                },
            },
        });

        return NextResponse.json(reservations);
    } catch (error) {
        console.error('Ошибка при получении бронирований:', error);
        return NextResponse.json({ message: 'Ошибка при получении бронирований' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await auth();

    if (!session || !session.user) {
        return NextResponse.json({ message: 'Неавторизован' }, { status: 401 });
    }

    const { startDate, endDate, totalPrice, postId } = await request.json();

    if (!startDate || !endDate || isAfter(new Date(startDate), new Date(endDate))) {
        return NextResponse.json({ message: 'Некорректные даты' }, { status: 400 });
    }

    try {
        const existingReservations = await prisma.reservation.findMany({
            where: {
                postId,
                OR: [
                    { startDate: { lte: new Date(endDate) }, endDate: { gte: new Date(startDate) } },
                ],
            },
        });

        if (existingReservations.length > 0) {
            return NextResponse.json({ message: 'Даты пересекаются с существующими бронированиями' }, { status: 409 });
        }

        const reservation = await prisma.reservation.create({
            data: {
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                totalPrice,
                postId,
                userId: session.user.id,
            },
        });

        return NextResponse.json(reservation);
    } catch (error) {
        console.error('Ошибка при создании бронирования:', error);
        return NextResponse.json({ message: 'Ошибка при создании бронирования' }, { status: 500 });
    }
}

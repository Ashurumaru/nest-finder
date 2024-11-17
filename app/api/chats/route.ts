import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/prisma/prisma";

// Получить список чатов
export async function GET() {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
    }

    const userId = session.user.id;

    try {
        const chats = await prisma.chat.findMany({
            where: {
                users: {
                    some: { userId },
                },
            },
            include: {
                users: {
                    select: { user: { select: { id: true, name: true, email: true, image: true } } },
                },
                messages: {
                    orderBy: { sentAt: "desc" },
                },
            },
        });

        // Подсчет непрочитанных сообщений
        const chatsWithUnreadCount = await Promise.all(
            chats.map(async (chat) => {
                const unreadCount = await prisma.message.count({
                    where: {
                        chatId: chat.id,
                        read: false,
                        userId: { not: userId }, // Только сообщения не от текущего пользователя
                    },
                });
                return {
                    ...chat,
                    unreadCount,
                };
            })
        );

        return NextResponse.json(chatsWithUnreadCount);
    } catch (error) {
        console.error("Ошибка при получении чатов:", error);
        return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
    }
}


export async function POST(request: Request) {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
    }

    const userId = session.user.id;

    try {
        const { recipientId } = await request.json();

        if (!recipientId) {
            return NextResponse.json({ message: "Не указан получатель" }, { status: 400 });
        }

        const existingChat = await prisma.chat.findFirst({
            where: {
                AND: [
                    {
                        users: {
                            some: { userId },
                        },
                    },
                    {
                        users: {
                            some: { userId: recipientId },
                        },
                    },
                ],
            },
            select: { id: true },
        });

        if (existingChat) {
            return NextResponse.json({ id: existingChat.id });
        }

        const newChat = await prisma.chat.create({
            data: {
                users: {
                    create: [
                        { userId },
                        { userId: recipientId },
                    ],
                },
            },
            include: {
                users: {
                    select: { user: { select: { id: true, name: true, email: true, image: true } } },
                },
            },
        });

        return NextResponse.json({ id: newChat.id }, { status: 201 });
    } catch (error) {
        console.error("Ошибка при создании чата:", error);
        return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
    }
}


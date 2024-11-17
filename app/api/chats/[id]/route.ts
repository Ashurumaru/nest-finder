import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/prisma/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id: chatId } = params;
    // const session = await auth();

    // if (!session || !session.user || !session.user.id) {
    //     return NextResponse.json({ message: 'Неавторизован' }, { status: 401 });
    // }

    try {
        const chat = await prisma.chat.findUnique({
            where: { id: chatId },
            include: {
                users: {
                    include: { user: { select: { id: true, name: true, image: true } } },
                },
                messages: {
                    include: { user: { select: { id: true, name: true, image: true } } },
                    orderBy: { sentAt: "asc" },
                },
            },
        });

        if (!chat) {
            return NextResponse.json({ message: "Чат не найден" }, { status: 404 });
        }

        return NextResponse.json(chat);
    } catch (error) {
        console.error("Ошибка при получении чата:", error);
        return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
    }
}

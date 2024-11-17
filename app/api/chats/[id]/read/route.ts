import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/prisma/prisma";

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const { id: chatId } = params;
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
    }

    const userId = session.user.id;

    try {
        await prisma.message.updateMany({
            where: {
                chatId,
                userId: { not: userId },
                read: false,
            },
            data: {
                read: true,
            },
        });

        return NextResponse.json({ message: "Сообщения отмечены как прочитанные" }, { status: 200 });
    } catch (error) {
        console.error("Ошибка при обновлении статуса сообщений:", error);
        return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
    }
}

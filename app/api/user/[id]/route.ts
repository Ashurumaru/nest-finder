// app/api/user/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    console.log('Received ID:', params.id); // Отладка ID

    const user = await prisma.user.findUnique({
        where: { id: params.id },
    });

    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
}

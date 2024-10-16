import { auth } from '@/auth';
import prisma from '@/prisma/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json({ isAdmin: false, error: 'Not authenticated' });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user || user.role !== 'admin') {
        return NextResponse.json({ isAdmin: false, error: 'Not authorized' });
    }

    return NextResponse.json({ isAdmin: true });
}

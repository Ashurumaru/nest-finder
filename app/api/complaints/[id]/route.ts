// app/api/complaints/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/prisma/prisma';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        const user = session?.user;

        if (!user || !user.id || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;
        const { status } = await request.json();

        if (!['PENDING', 'RESOLVED', 'REJECTED'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const complaint = await prisma.complaint.update({
            where: { id },
            data: { status },
            include: {
                post: {
                    select: {
                        id: true,
                        title: true,
                        address: true,
                        city: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        email: true,
                    },
                },
            },
        });

        return NextResponse.json(complaint);
    } catch (error) {
        console.error('Error updating complaint:', error);
        return NextResponse.json(
            { error: 'Failed to update complaint' },
            { status: 500 }
        );
    }
}
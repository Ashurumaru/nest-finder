// app/api/complaints/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/prisma/prisma';
import { ComplaintStatus } from '@prisma/client';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        const user = session?.user;

        if (!user || !user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { postId, reason, description } = await request.json();

        if (!postId || !reason) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if the post exists
        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Check if user already complained about this post
        const existingComplaint = await prisma.complaint.findFirst({
            where: {
                postId,
                userId: user.id,
            },
        });

        if (existingComplaint) {
            return NextResponse.json(
                { error: 'You have already submitted a complaint for this post' },
                { status: 409 }
            );
        }

        const complaint = await prisma.complaint.create({
            data: {
                postId,
                userId: user.id,
                reason,
                description,
                status: 'PENDING',
            },
        });

        return NextResponse.json(complaint, { status: 201 });
    } catch (error) {
        console.error('Error creating complaint:', error);
        return NextResponse.json(
            { error: 'Failed to create complaint' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        const user = session?.user;

        if (!user || !user.id || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const [complaints, total] = await Promise.all([
            prisma.complaint.findMany({
                where: status ? {
                    status: status as ComplaintStatus
                } : {},
                include: {
                    post: {
                        select: {
                            id: true,
                            title: true,
                            address: true,
                            city: true,
                            type: true,
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
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.complaint.count({
                where: status ? {
                    status: status as ComplaintStatus
                } : {}
            }),
        ]);


        return NextResponse.json({
            complaints,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching complaints:', error);
        return NextResponse.json(
            { error: 'Failed to fetch complaints' },
            { status: 500 }
        );
    }
}


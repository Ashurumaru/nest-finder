// app/api/properties/map/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { Decimal } from '@prisma/client/runtime/library';

// Mark this route as dynamic to prevent static rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        // Use NextRequest instead of Request for better Next.js integration
        const searchParams = request.nextUrl.searchParams;

        // Get map boundaries
        const swLat = parseFloat(searchParams.get('swLat') || '0');
        const swLng = parseFloat(searchParams.get('swLng') || '0');
        const neLat = parseFloat(searchParams.get('neLat') || '0');
        const neLng = parseFloat(searchParams.get('neLng') || '0');

        // Get filter parameters
        const type = searchParams.get('type') || undefined;
        const property = searchParams.get('property') || undefined;
        const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice') as string) : undefined;
        const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice') as string) : undefined;
        const rooms = searchParams.getAll('rooms');

        // Build query conditions
        const where: any = {
            isArchive: false,
        };

        // Only add latitude/longitude filters if they're valid numbers
        if (!isNaN(swLat) && !isNaN(neLat) && !isNaN(swLng) && !isNaN(neLng)) {
            where.latitude = {
                gte: new Decimal(swLat),
                lte: new Decimal(neLat)
            };
            where.longitude = {
                gte: new Decimal(swLng),
                lte: new Decimal(neLng)
            };
        }

        if (type) {
            where.type = type;
        }

        if (property) {
            where.property = property;
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};

            if (minPrice !== undefined) {
                where.price.gte = new Decimal(minPrice);
            }

            if (maxPrice !== undefined) {
                where.price.lte = new Decimal(maxPrice);
            }
        }

        // Handle room filtering
        if (rooms && rooms.length > 0) {
            where.OR = [];

            for (const room of rooms) {
                const roomNumber = parseInt(room, 10);

                // For studios
                if (roomNumber === 0) {
                    where.OR.push({
                        apartment: {
                            numBedrooms: 0
                        }
                    });
                }
                // For 1-3 bedroom apartments
                else if (roomNumber >= 1 && roomNumber <= 3) {
                    where.OR.push({
                        apartment: {
                            numBedrooms: roomNumber
                        }
                    });
                    where.OR.push({
                        house: {
                            numberOfRooms: roomNumber
                        }
                    });
                }
                // For 4+ bedroom apartments/houses
                else if (roomNumber === 4) {
                    where.OR.push({
                        apartment: {
                            numBedrooms: {
                                gte: 4
                            }
                        }
                    });
                    where.OR.push({
                        house: {
                            numberOfRooms: {
                                gte: 4
                            }
                        }
                    });
                }
            }
        }

        const properties = await prisma.post.findMany({
            where,
            include: {
                apartment: true,
                house: true,
                landPlot: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        image: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 100 // Limit results count
        });

        return NextResponse.json(properties);
    } catch (error) {
        console.error('Error getting properties:', error);
        return NextResponse.json(
            { message: 'Failed to get properties' },
            { status: 500 }
        );
    }
}
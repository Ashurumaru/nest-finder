import { NextResponse } from 'next/server';
import { getProperties } from '@/utils/getProperties';
import { PropertyFilters } from "@/types/propertyTypes";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const type = url.searchParams.get('type') as 'SALE' | 'RENT' | undefined;
        const userId = url.searchParams.get('userId') || undefined;
        const searchQuery = url.searchParams.get('searchQuery') || undefined;
        const propertyType = url.searchParams.get('propertyType') as 'APARTMENT' | 'HOUSE' | 'LAND_PLOT' | undefined;
        const minPrice = url.searchParams.get('minPrice') ? parseFloat(url.searchParams.get('minPrice')!) : undefined;
        const maxPrice = url.searchParams.get('maxPrice') ? parseFloat(url.searchParams.get('maxPrice')!) : undefined;
        const minBedrooms = url.searchParams.get('minBedrooms') ? parseInt(url.searchParams.get('minBedrooms')!) : undefined;
        const maxBedrooms = url.searchParams.get('maxBedrooms') ? parseInt(url.searchParams.get('maxBedrooms')!) : undefined;

        const filters: PropertyFilters = {
            type,
            userId,
            searchQuery,
            propertyType,
            minPrice,
            maxPrice,
            minBedrooms,
            maxBedrooms,
        };

        const properties = await getProperties(filters);
        return NextResponse.json(properties);
    } catch (error) {
        console.error('Ошибка при получении недвижимости:', error);
        return NextResponse.json({ message: 'Ошибка при получении недвижимости' }, { status: 500 });
    }
}

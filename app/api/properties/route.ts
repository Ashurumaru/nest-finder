import { NextResponse } from 'next/server';
import { getProperties } from '@/utils/getProperties';
import {getAllProperties} from "@/utils/getAllProperty";

export async function GET(request: Request) {
    try {
        const properties = await getAllProperties();

        return NextResponse.json(properties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        return NextResponse.json({ message: 'Error fetching properties' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    const properties = await getProperties(body);
    return NextResponse.json(properties);
}

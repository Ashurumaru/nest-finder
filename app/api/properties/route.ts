import { NextResponse } from 'next/server';
import { getProperties } from '@/utils/getProperties';

export async function POST(request: Request) {
    const body = await request.json();

    const properties = await getProperties(body);

    return NextResponse.json(properties);
}

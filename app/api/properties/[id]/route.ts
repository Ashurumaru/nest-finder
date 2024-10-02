import { NextResponse } from 'next/server';
import { getPropertyById } from '@/utils/getPropertyById'; // Импорт функции

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    // Получаем объект недвижимости по ID
    const property = await getPropertyById(id);

    // Если объект не найден, возвращаем 404
    if (!property) {
        return NextResponse.json({ message: 'Property not found' }, { status: 404 });
    }

    // Возвращаем данные о недвижимости
    return NextResponse.json(property);
}

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { code, redirectUri } = await request.json();

        if (!code || !redirectUri) {
            return NextResponse.json({
                error: 'invalid_request',
                error_description: 'Code and redirectUri are required'
            }, { status: 400 });
        }

        // Получаем токен от VK API
        const tokenUrl = new URL('https://oauth.vk.com/access_token');
        tokenUrl.searchParams.append('client_id', process.env.VK_ID || '');
        tokenUrl.searchParams.append('client_secret', process.env.VK_SECRET || '');
        tokenUrl.searchParams.append('redirect_uri', redirectUri);
        tokenUrl.searchParams.append('code', code);

        const tokenResponse = await fetch(tokenUrl.toString(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        const tokenData = await tokenResponse.json();

        // Проверяем на наличие ошибок
        if (tokenData.error) {
            console.error('VK token error:', tokenData);
            return NextResponse.json(tokenData, { status: 400 });
        }

        return NextResponse.json(tokenData);
    } catch (error) {
        console.error('Error getting VK token:', error);
        return NextResponse.json({
            error: 'server_error',
            error_description: 'Internal server error'
        }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { code } = await req.json();

        if (!code) {
            return NextResponse.json(
                { error: 'No code provided' },
                { status: 400 }
            );
        }

        const clientId = process.env.VK_ID;
        const clientSecret = process.env.VK_SECRET;
        const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/vk`;

        // Запрос на получение токена
        const tokenResponse = await fetch(
            `https://oauth.vk.com/access_token?client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUri}&code=${code}`,
            { method: 'GET' }
        );

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            console.error('VK token error:', tokenData);
            return NextResponse.json(
                { error: tokenData.error, description: tokenData.error_description },
                { status: 400 }
            );
        }

        // Получаем информацию о пользователе
        const userResponse = await fetch(
            `https://api.vk.com/method/users.get?fields=photo_100&access_token=${tokenData.access_token}&v=5.199`,
            { method: 'GET' }
        );

        const userData = await userResponse.json();

        return NextResponse.json({
            access_token: tokenData.access_token,
            user: userData.response?.[0] || null,
            email: tokenData.email || null
        });
    } catch (error) {
        console.error('VK token handler error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
 }
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
        // Если код отсутствует, перенаправляем на страницу ошибки
        return NextResponse.redirect(new URL('/auth/error?error=no_code', request.url));
    }

    try {
        // Получаем токен
        const clientId = process.env.VK_ID;
        const clientSecret = process.env.VK_SECRET;
        const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/vk-custom`;

        const tokenResponse = await fetch(
            `https://oauth.vk.com/access_token?client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUri}&code=${code}`,
            { method: 'GET' }
        );

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            return NextResponse.redirect(
                new URL(`/auth/error?error=${tokenData.error}&description=${tokenData.error_description}`, request.url)
            );
        }

        // Получаем информацию о пользователе
        const userResponse = await fetch(
            `https://api.vk.com/method/users.get?fields=photo_100&access_token=${tokenData.access_token}&v=5.131`,
            { method: 'GET' }
        );

        const userData = await userResponse.json();

        if (!userData.response || !userData.response[0]) {
            return NextResponse.redirect(
                new URL('/auth/error?error=user_info_failed', request.url)
            );
        }

        const user = userData.response[0];

        // Создаем сессию
        const session = await auth();

        // Перенаправляем на профиль
        return NextResponse.redirect(new URL('/profile', request.url));
    } catch (error) {
        console.error('VK callback error:', error);
        return NextResponse.redirect(
            new URL('/auth/error?error=internal_server_error', request.url)
        );
    }
}

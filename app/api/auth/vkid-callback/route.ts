// app/api/auth/vkid-callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/auth';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const deviceId = searchParams.get('device_id');
    const callbackUrl = searchParams.get('callbackUrl') || '/profile';

    if (!code || !deviceId) {
        return NextResponse.redirect(new URL('/login?error=missing_params', request.url));
    }

    try {
        // Обмен кода на токен
        const tokenResponse = await fetch('https://api.vk.com/method/auth.exchangeCode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: process.env.VK_ID,
                client_secret: process.env.VK_SECRET,
                code: code,
                device_id: deviceId,
                v: '5.199',
            }),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            console.error('VK ID token exchange error:', tokenData.error);
            return NextResponse.redirect(new URL(`/login?error=${tokenData.error.error_msg}`, request.url));
        }

        // Получение информации о пользователе
        const accessToken = tokenData.response.access_token;
        const userInfo = await fetch(`https://api.vk.com/method/users.get?access_token=${accessToken}&v=5.199`);
        const userData = await userInfo.json();

        // Создаем сессию с помощью NextAuth
        await signIn('vk-id', {
            access_token: accessToken,
            user: userData.response[0],
            redirect: false,
        });

        return NextResponse.redirect(new URL(callbackUrl, request.url));
    } catch (error) {
        console.error('VK ID callback error:', error);
        return NextResponse.redirect(new URL('/login?error=vkid_callback_error', request.url));
    }
}

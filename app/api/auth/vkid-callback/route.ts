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
        // Exchange code for token
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

        // Get user information
        const accessToken = tokenData.response.access_token;
        const userResponse = await fetch(`https://api.vk.com/method/users.get?fields=photo_200&access_token=${accessToken}&v=5.199`);
        const userData = await userResponse.json();

        if (!userData.response || userData.response.length === 0) {
            return NextResponse.redirect(new URL('/login?error=user_info_error', request.url));
        }

        const user = userData.response[0];

        // Sign in with NextAuth
        const result = await signIn('vk-id', {
            redirect: false,
            // Pass user data
            // Note: This approach depends on whether your NextAuth provider can accept this data
            // You may need to adjust based on your NextAuth implementation
            providerAccountId: user.id.toString(),
            access_token: accessToken,
            // Add any other required data
        });

        if (result?.error) {
            return NextResponse.redirect(new URL(`/login?error=${result.error}`, request.url));
        }

        return NextResponse.redirect(new URL(callbackUrl, request.url));
    } catch (error: any) {
        console.error('VK ID callback error:', error);
        const errorMessage = error.message || 'vkid_callback_error';
        return NextResponse.redirect(new URL(`/login?error=${errorMessage}`, request.url));
    }
}
// app/api/auth/callback/vk/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const deviceId = searchParams.get('device_id');

    if (!code) {
        return NextResponse.redirect(new URL('/login?error=missing_code', request.url));
    }

    try {
        // Redirect to the NextAuth callback URL with the VK code
        const callbackUrl = new URL('/api/auth/callback/vk', request.url);
        callbackUrl.searchParams.append('code', code);
        if (deviceId) {
            callbackUrl.searchParams.append('device_id', deviceId);
        }

        return NextResponse.redirect(callbackUrl);
    } catch (error) {
        console.error('VK callback error:', error);
        return NextResponse.redirect(new URL('/login?error=vk_callback', request.url));
    }
}
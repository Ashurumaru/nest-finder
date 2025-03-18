// components/auth/VKIDAuth.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface VKIDAuthProps {
    callbackUrl?: string;
}

export const VKIDAuth = ({ callbackUrl = '/profile' }: VKIDAuthProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        // Dynamically load VK ID SDK
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js';
        script.async = true;

        script.onload = () => {
            if ('VKIDSDK' in window) {
                const VKID = (window as any).VKIDSDK;

                // Important: This redirect URL should match what you've set up in NextAuth and VK developer cabinet
                const redirectUrl = 'https://nest-finder-diplom.vercel.app/api/auth/callback/vk-id';

                VKID.Config.init({
                    app: 53279730,
                    redirectUrl: redirectUrl,
                    responseMode: VKID.ConfigResponseMode.Callback,
                    source: VKID.ConfigSource.LOWCODE,
                    scope: '',
                });

                if (containerRef.current) {
                    const oAuth = new VKID.OAuthList();

                    oAuth.render({
                        container: containerRef.current,
                        oauthList: [
                            'vkid',
                            'ok_ru',
                            'mail_ru'
                        ]
                    })
                        .on(VKID.WidgetEvents.ERROR, (error: any) => {
                            console.error('VK ID Auth Error:', error);
                        })
                        .on(VKID.OAuthListInternalEvents.LOGIN_SUCCESS, function (payload: any) {
                            const code = payload.code;
                            const deviceId = payload.device_id;

                            // Handle the redirect based on how your application is set up
                            // If using custom route handler:
                            router.push(`/api/auth/vkid-callback?code=${code}&device_id=${deviceId}&callbackUrl=${encodeURIComponent(callbackUrl)}`);

                            // Alternative: If using NextAuth's built-in callback handling:
                            // router.push(`/api/auth/callback/vk-id?code=${code}&state=${deviceId}&callbackUrl=${encodeURIComponent(callbackUrl)}`);
                        });
                }
            }
        };

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [callbackUrl, router]);

    return <div ref={containerRef} className="vkid-auth-container"></div>;
};
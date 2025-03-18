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
        // Динамически загружаем скрипт VK ID SDK
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js';
        script.async = true;

        script.onload = () => {
            if ('VKIDSDK' in window) {
                const VKID = (window as any).VKIDSDK;

                VKID.Config.init({
                    app: 53279730,
                    redirectUrl: 'https://nest-finder-diplom.vercel.app/api/auth/vkid-callback',
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

                            // Перенаправляем на наш API эндпоинт с кодом и deviceId
                            const callbackUrlWithParams = `/api/auth/vkid-callback?code=${code}&device_id=${deviceId}&callbackUrl=${encodeURIComponent(callbackUrl)}`;
                            router.push(callbackUrlWithParams);
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

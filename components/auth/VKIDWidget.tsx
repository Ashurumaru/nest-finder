// components/auth/VkIdAuthButton.tsx
'use client';

import { useEffect, useRef } from 'react';
import { signIn } from 'next-auth/react';

interface VkIdAuthButtonProps {
    callbackUrl?: string;
}

const VkIdAuthButton = ({ callbackUrl = '/profile' }: VkIdAuthButtonProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Проверяем, загружен ли VKID SDK
        if ('VKIDSDK' in window) {
            const VKID = (window as any).VKIDSDK;

            // Инициализация SDK
            VKID.Config.init({
                app: parseInt(process.env.NEXT_PUBLIC_VK_APP_ID || '53279730'),
                redirectUrl: `${window.location.origin}/api/auth/callback/vk`,
            });

            // Создание экземпляра виджета 3в1
            const oauthList = new VKID.OAuthList();

            const oauthListNames = [
                VKID.OAuthName.VK,
                VKID.OAuthName.MAIL,
                VKID.OAuthName.OK,
            ];

            if (containerRef.current) {
                // Отрисовка виджета
                oauthList.render({
                    container: containerRef.current,
                    oauthList: oauthListNames,
                    scheme: VKID.Scheme.LIGHT,
                    lang: VKID.Languages.RUS,
                    styles: { height: 44, borderRadius: 8 }
                });

                // Обработка успешной авторизации
                oauthList.on('VKIDOAuthListSuccess', function (data: any) {
                    // Инициируем авторизацию через next-auth
                    signIn('vk', {
                        callbackUrl
                    });
                });
            }
        }
    }, [callbackUrl]);

    return <div ref={containerRef} className="w-full mt-4"></div>;
};

export default VkIdAuthButton;

// components/auth/VkIdAuthButton.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface VkIdAuthButtonProps {
    callbackUrl?: string;
}

const VkIdAuthButton = ({ callbackUrl = '/profile' }: VkIdAuthButtonProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

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
                oauthList.on('VKIDOAuthListSuccess', async function (data: any) {
                    try {
                        // Получаем код авторизации
                        const code = data.code;

                        // Делаем запрос на получение токена напрямую
                        const response = await fetch('/api/auth/vk-token', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ code })
                        });

                        const tokenData = await response.json();

                        if (tokenData.error) {
                            setError(tokenData.description || 'Ошибка авторизации');
                            return;
                        }

                        // Создаем сессию через NextAuth
                        if (tokenData.access_token) {
                            const result = await signIn('vk', {
                                access_token: tokenData.access_token,
                                user: JSON.stringify(tokenData.user),
                                email: tokenData.email,
                                redirect: false,
                                callbackUrl
                            });

                            if (result?.error) {
                                setError(result.error);
                            } else if (result?.url) {
                                router.push(result.url);
                            }
                        }
                    } catch (err) {
                        console.error('VK auth error:', err);
                        setError('Произошла ошибка при авторизации');
                    }
                });

                oauthList.on('VKIDOAuthListFailed', function (data: any) {
                    setError('Ошибка авторизации: ' + (data.error || 'неизвестная ошибка'));
                });
            }
        }
    }, [callbackUrl, router]);

    return (
        <div>
            <div ref={containerRef} className="w-full mt-4"></div>
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </div>
    );
};

export default VkIdAuthButton;

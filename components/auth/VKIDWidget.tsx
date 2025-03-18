// components/auth/VkIdAuthButton.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface VkIdAuthButtonProps {
    callbackUrl?: string;
}

const VkIdAuthButton = ({ callbackUrl = '/profile' }: VkIdAuthButtonProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Проверяем, загружен ли VKID SDK
        if ('VKIDSDK' in window) {
            const VKID = (window as any).VKIDSDK;

            // Инициализация SDK
            VKID.Config.init({
                app: parseInt(process.env.NEXT_PUBLIC_VK_APP_ID || '53279730'),
                redirectUrl: `${window.location.origin}/api/auth/vk-callback`,
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

                        // Делаем запрос на получение токена через наш API
                        const response = await fetch('/api/auth/vk-token', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                code,
                                redirectUri: `${window.location.origin}/api/auth/vk-callback`
                            })
                        });

                        const tokenData = await response.json();

                        if (tokenData.error) {
                            setError(tokenData.error_description || 'Ошибка авторизации');
                            return;
                        }

                        // Если получили токен, создаем сессию
                        if (tokenData.access_token) {
                            // Запрос на создание сессии
                            const sessionResponse = await fetch('/api/auth/vk-session', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    accessToken: tokenData.access_token,
                                    userId: tokenData.user_id,
                                    email: tokenData.email
                                })
                            });

                            const sessionData = await sessionResponse.json();

                            if (sessionData.success) {
                                // Перенаправляем на страницу профиля
                                router.push(callbackUrl);
                            } else {
                                setError(sessionData.error || 'Не удалось создать сессию');
                            }
                        }
                    } catch (err) {
                        console.error('Ошибка авторизации VK:', err);
                        setError('Произошла ошибка при авторизации');
                    }
                });

                // Обработка ошибок
                oauthList.on('VKIDOAuthListFail', function (data: any) {
                    setError('Ошибка авторизации: ' + (data.error_description || data.error || 'Неизвестная ошибка'));
                });
            }
        }
    }, [callbackUrl, router]);

    return (
        <div>
            <div ref={containerRef} className="w-full mt-4"></div>
            {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
        </div>
    );
};

export default VkIdAuthButton;

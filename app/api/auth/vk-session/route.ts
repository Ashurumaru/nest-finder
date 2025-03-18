import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { cookies } from 'next/headers';
import { encode } from 'next-auth/jwt';

export async function POST(request: NextRequest) {
    try {
        const { accessToken, userId, email } = await request.json();

        if (!accessToken || !userId) {
            return NextResponse.json({
                success: false,
                error: 'Отсутствуют необходимые данные'
            }, { status: 400 });
        }

        // Получаем информацию о пользователе из VK API
        const userInfoUrl = new URL('https://api.vk.com/method/users.get');
        userInfoUrl.searchParams.append('access_token', accessToken);
        userInfoUrl.searchParams.append('fields', 'photo_200');
        userInfoUrl.searchParams.append('v', '5.131');

        const userInfoResponse = await fetch(userInfoUrl.toString());
        const userInfoData = await userInfoResponse.json();

        if (!userInfoData.response || !userInfoData.response[0]) {
            return NextResponse.json({
                success: false,
                error: 'Не удалось получить данные пользователя'
            }, { status: 400 });
        }

        const vkUser = userInfoData.response[0];
        const name = `${vkUser.first_name} ${vkUser.last_name}`;
        const image = vkUser.photo_200;

        // Ищем пользователя в базе данных или создаем нового
        let user = await prisma.user.findFirst({
            where: {
                accounts: {
                    some: {
                        provider: 'vk',
                        providerAccountId: String(userId)
                    }
                }
            }
        });

        if (!user) {
            // Если есть email, проверяем, существует ли пользователь с таким email
            if (email) {
                user = await prisma.user.findUnique({
                    where: { email }
                });
            }

            // Если пользователя нет, создаем нового
            if (!user) {
                user = await prisma.user.create({
                    data: {
                        name,
                        email: email || null,
                        image,
                        role: "USER"
                    }
                });
            }

            // Создаем запись об аккаунте
            await prisma.account.create({
                data: {
                    userId: user.id,
                    type: 'oauth',
                    provider: 'vk',
                    providerAccountId: String(userId),
                    access_token: accessToken,
                    token_type: 'bearer'
                }
            });
        } else {
            // Обновляем данные пользователя
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    name,
                    image
                }
            });

            // Обновляем токен
            await prisma.account.updateMany({
                where: {
                    userId: user.id,
                    provider: 'vk'
                },
                data: {
                    access_token: accessToken
                }
            });
        }

        // Создаем JWT токен для сессии
        const token = await encode({
            token: {
                id: user.id,
                name: user.name,
                email: user.email,
                picture: user.image,
                role: user.role,
                sub: user.id
            },
            secret: process.env.NEXTAUTH_SECRET || 'secret',
            salt: process.env.NODE_ENV === "production"
                ? "__Secure-next-auth.session-token"
                : "next-auth.session-token"
        });

        // Устанавливаем cookie с сессией
        cookies().set({
            name: 'next-auth.session-token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60, // 30 дней
            path: '/'
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error creating VK session:', error);
        return NextResponse.json({
            success: false,
            error: 'Внутренняя ошибка сервера'
        }, { status: 500 });
    }
}

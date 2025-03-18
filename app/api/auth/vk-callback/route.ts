import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    // Этот маршрут нужен только для получения кода авторизации от VK
    // Реальная обработка происходит на стороне клиента в компоненте VkIdAuthButton

    // Получаем код из URL
    const code = request.nextUrl.searchParams.get('code');

    // Если есть ошибка, показываем страницу с ошибкой
    const error = request.nextUrl.searchParams.get('error');
    const errorDescription = request.nextUrl.searchParams.get('error_description');

    if (error) {
        return NextResponse.redirect(
            new URL(`/auth/error?error=${error}&description=${errorDescription || ''}`, request.url)
        );
    }

    // Если нет кода, перенаправляем на страницу входа
    if (!code) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Отображаем страницу, которая закроет окно и передаст код родительскому окну
    return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Авторизация VK</title>
            <script>
                window.opener.postMessage({ type: 'VK_AUTH_CODE', code: '${code}' }, '*');
                window.close();
            </script>
        </head>
        <body>
            <p>Авторизация успешна. Это окно можно закрыть.</p>
        </body>
        </html>
        `,
        {
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
            },
        }
    );
}

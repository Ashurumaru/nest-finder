// auth.ts (root directory)
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import prisma from './prisma/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import YandexProvider from 'next-auth/providers/yandex';
import VKProvider from 'next-auth/providers/vk';
import bcrypt from 'bcryptjs';
import {OAuthConfig, OAuthUserConfig} from "@auth/core/providers";

export interface VKProfile {
  response: Array<{
    id: number;
    first_name: string;
    last_name: string;
    photo_100: string;
    email?: string;
  }>;
}

export default function CustomVKProvider<P extends VKProfile>(
    options: OAuthUserConfig<P>
): OAuthConfig<P> {
  const apiVersion = "5.199";

  return {
    id: "vk-custom",
    name: "VK",
    type: "oauth",
    checks: ["none"],
    authorization: {
      url: `https://oauth.vk.com/authorize`,
      params: {
        scope: "email",
        response_type: "code",
        v: apiVersion
      }
    },
    token: {
      url: `https://oauth.vk.com/access_token`,
      params: { v: apiVersion }
    },
    userinfo: {
      url: `https://api.vk.com/method/users.get`,
      params: {
        fields: "photo_100",
        v: apiVersion
      }
    },
    profile(result: P) {
      const profile = result.response?.[0] ?? {};
      return {
        id: profile.id.toString(),
        name: [profile.first_name, profile.last_name].filter(Boolean).join(" "),
        email: null,
        image: profile.photo_100,
      };
    },
    style: { logo: "/vk.svg", bg: "#07F", text: "#fff" },
    ...options,
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  // @ts-ignore
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  providers: [
    YandexProvider({
      clientId: process.env.YANDEX_ID,
      clientSecret: process.env.YANDEX_SECRET,
      authorization: {
        params: {
          scope: "login:email login:info"
        }
      }
    }),
    CustomVKProvider({
      clientId: process.env.VK_ID,
      clientSecret: process.env.VK_SECRET,
    }) as any,
    CredentialsProvider({
      name: 'Sign in',
      id: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: String(credentials.email),
          },
        });

        if (
            !user ||
            !(await bcrypt.compare(String(credentials.password), user.hashedPassword!))
        ) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    // Handling OAuthAccountNotLinked issue
    signIn: async ({ user, account, profile }) => {
      // Обработка кастомного VK провайдера
      if (account && account.provider === 'vk-custom') {
        // Если у пользователя нет email (часто случается с VK),
        // создаем уникальный идентификатор на основе providerAccountId
        const vkEmail = user.email || `vk-user-${account.providerAccountId}@example.com`;

        // Ищем существующего пользователя по email или по providerAccountId
        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [
              { email: vkEmail },
              {
                accounts: {
                  some: {
                    provider: 'vk-custom',
                    providerAccountId: account.providerAccountId
                  }
                }
              }
            ]
          },
          include: { accounts: true },
        });

        // Если пользователь найден
        if (existingUser) {
          // Проверяем, есть ли уже связанный аккаунт VK
          const linkedAccount = existingUser.accounts.find(
              (acc) => acc.provider === 'vk-custom' && acc.providerAccountId === account.providerAccountId
          );

          if (!linkedAccount) {
            // Создаем связь с аккаунтом
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            });
          }

          // Обновляем токен доступа, если он изменился
          else if (linkedAccount.access_token !== account.access_token && account.access_token) {
            await prisma.account.update({
              where: { id: linkedAccount.id },
              data: {
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
              },
            });
          }

          return true;
        }

        // Если пользователь не найден, продолжаем стандартный процесс создания
        // NextAuth автоматически создаст пользователя и аккаунт
        // Но можно добавить дополнительную логику, если нужно
        if (!user.email) {
          // Устанавливаем email для пользователя, если он не был предоставлен VK
          user.email = vkEmail;
        }
      }

      // Стандартная обработка для других провайдеров
      if (account && account.provider !== 'credentials' && user.email) {
        // Find existing user by email
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { accounts: true },
        });

        // If user found
        if (existingUser) {
          // Check if they already have an account with this provider
          const linkedAccount = existingUser.accounts.find(
              (acc) => acc.provider === account.provider
          );

          if (!linkedAccount) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            });
          }
          return true;
        }
      }

      // Логирование для отладки
      console.log('Sign in success for user:', user.id);
      return true;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const paths = ['/profile',];
      const isProtected = paths.some((path) =>
          nextUrl.pathname.startsWith(path)
      );

      if (isProtected && !isLoggedIn) {
        const redirectUrl = new URL('/api/auth/signin', nextUrl.origin);
        redirectUrl.searchParams.append('callbackUrl', nextUrl.href);
        return Response.redirect(redirectUrl);
      }
      return true;
    },

    jwt: ({ token, user }) => {
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
          role: u.role,
        };
      }
      return token;
    },

    session(params) {
      const { session, token, user } = params as {
        session: Session;
        token?: JWT;
        user?: {
          id: string;
          name: string;
          email: string;
          role: string;
        };
      };

      if (token) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.id as string,
            role: token.role,
          },
        };
      }

      // Fallback if token is missing
      return {
        ...session,
        user: {
          ...session.user,
          id: user?.id ?? "",
        },
      };
    },
  },
});
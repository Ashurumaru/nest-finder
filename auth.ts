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
    VKProvider({
      clientId: process.env.VK_ID,
      clientSecret: process.env.VK_SECRET,
      // Дополнительные параметры при необходимости
    }),
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
      // Check if this is OAuth login and user has email
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
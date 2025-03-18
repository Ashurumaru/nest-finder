import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import prisma from './prisma/prisma';
import vk from 'next-auth/providers/vk';
import yandex from 'next-auth/providers/yandex';

import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  // @ts-ignore
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/login',
  },
  providers: [
    vk,
    yandex,
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

      // Фолбэк на случай, если токен отсутствует
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
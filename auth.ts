// auth.ts
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import prisma from './prisma/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import YandexProvider from 'next-auth/providers/yandex';
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
    {
      id: 'vk-id',
      name: 'VK ID',
      type: 'oauth',
      authorization: {
        url: "https://oauth.vk.com/authorize",
        params: {
          scope: "email",
          response_type: "code",
          v: "5.199"
        }
      },
      token: {
        url: "https://oauth.vk.com/access_token",
        params: { v: "5.199" }
      },
      userinfo: {
        url: "https://api.vk.com/method/users.get",
        params: { fields: "photo_200", v: "5.199" }
      },
      profile(profile, tokens) {
        return {
          id: profile.id.toString(),
          name: `${profile.first_name} ${profile.last_name}`,
          email: profile.email || `${profile.id}@vk.com`,
          image: profile.photo_200 || null,
        };
      },
      clientId: process.env.VK_ID!,
      clientSecret: process.env.VK_SECRET!,
    },
    YandexProvider({
      clientId: process.env.YANDEX_ID,
      clientSecret: process.env.YANDEX_SECRET,
      authorization: {
        params: {
          scope: "login:email login:info"
        }
      }
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
    // Adding callback to solve OAuthAccountNotLinked problem
    signIn: async ({ user, account, profile }) => {
      // Check if this is OAuth login and the user has an email
      if (account && account.provider !== 'credentials' && user.email) {
        // Find existing user by email
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { accounts: true },
        });

        // If user found
        if (existingUser) {
          // Check if they already have a linked account for this provider
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

      // Fallback in case token is missing
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
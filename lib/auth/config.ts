import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/database/prisma';
import { Adapter } from 'next-auth/adapters';

const demoAdminEmail = process.env.DEMO_ADMIN_EMAIL ?? "demo@elysium.dev";
const demoAdminPassword = process.env.DEMO_ADMIN_PASSWORD ?? "DemoAdmin123!";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const isDemoCredentials =
          demoAdminEmail &&
          demoAdminPassword &&
          credentials.email === demoAdminEmail &&
          credentials.password === demoAdminPassword;

        if (isDemoCredentials) {
          return {
            id: 'demo-admin',
            email: demoAdminEmail,
            name: 'Demo Admin',
            role: 'ADMIN',
          };
        }

        let user = null;

        try {
          user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          });
        } catch (error) {
          console.error('Error fetching user for credentials login', error);
          throw new Error('Unable to authenticate right now. Please try again later.');
        }

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        } as any;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role ?? 'CUSTOMER';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

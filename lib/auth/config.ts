import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

// Log auth configuration state
function logAuthConfig() {
  const useMockAuth = process.env.USE_MOCK_AUTH;
  const nextAuthSecret = process.env.NEXTAUTH_SECRET;
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  const hasDatabaseUrl = !!process.env.DATABASE_URL;
  
  console.log('[AUTH] Configuration:', {
    USE_MOCK_AUTH: useMockAuth || 'undefined',
    hasNextAuthSecret: !!nextAuthSecret,
    nextAuthSecretLength: nextAuthSecret ? nextAuthSecret.length : 0,
    hasNextAuthUrl: !!nextAuthUrl,
    nextAuthUrl: nextAuthUrl || 'undefined',
    hasDatabaseUrl,
  });
  
  // Validate NEXTAUTH_SECRET
  if (!nextAuthSecret) {
    console.error('[AUTH] ERROR: NEXTAUTH_SECRET is not set!');
  } else if (nextAuthSecret.length < 32) {
    console.error('[AUTH] ERROR: NEXTAUTH_SECRET must be at least 32 characters long!');
  }
  
  // Validate NEXTAUTH_URL
  if (!nextAuthUrl) {
    console.error('[AUTH] ERROR: NEXTAUTH_URL is not set!');
  }
}

// Initialize logging on module load
logAuthConfig();

// Validate required environment variables
const nextAuthSecret = process.env.NEXTAUTH_SECRET;
const nextAuthUrl = process.env.NEXTAUTH_URL;

if (!nextAuthSecret) {
  throw new Error('NEXTAUTH_SECRET environment variable is required but not set. Please set it in AWS Amplify Console environment variables.');
}

if (nextAuthSecret.length < 32) {
  throw new Error(`NEXTAUTH_SECRET must be at least 32 characters long. Current length: ${nextAuthSecret.length}`);
}

if (!nextAuthUrl) {
  console.warn('[AUTH] WARNING: NEXTAUTH_URL is not set. This may cause issues with authentication callbacks.');
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          console.log('[AUTH] Attempting to query user:', credentials.email);
          
          const result = await query(
            'SELECT * FROM users WHERE email = $1',
            [credentials.email]
          );

          if (result.rows.length === 0) {
            console.log('[AUTH] User query result: Not found');
            return null;
          }

          const user = result.rows[0];
          console.log('[AUTH] User query result: Found');

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password_hash
          );

          if (!isValidPassword) {
            console.log('[AUTH] Password validation: Failed');
            return null;
          }

          console.log('[AUTH] Password validation: Success');
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('[AUTH] Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: nextAuthSecret,
  debug: process.env.NODE_ENV === 'development',
};


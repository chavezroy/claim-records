import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

// Log auth configuration state
function logAuthConfig() {
  const useMockAuth = process.env.USE_MOCK_AUTH;
  const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET;
  const hasNextAuthUrl = !!process.env.NEXTAUTH_URL;
  const hasDatabaseUrl = !!process.env.DATABASE_URL;
  
  console.log('[AUTH] Configuration:', {
    USE_MOCK_AUTH: useMockAuth || 'undefined',
    hasNextAuthSecret,
    hasNextAuthUrl,
    hasDatabaseUrl,
  });
}

// Initialize logging on module load
logAuthConfig();

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
  secret: process.env.NEXTAUTH_SECRET,
};


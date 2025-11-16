import { getServerSession } from 'next-auth';
import { authOptions } from './config';

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if ((session.user as any)?.role !== 'admin') {
    throw new Error('Forbidden: Admin access required');
  }
  return session;
}


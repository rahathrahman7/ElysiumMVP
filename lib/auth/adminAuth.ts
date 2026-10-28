import { getServerSession } from 'next-auth';
import { authOptions } from './config';
import { prisma } from '@/lib/database/prisma';
import { User } from '@prisma/client';
import { isAdminAuthDisabled, isDemoAdminBypassEnabled } from '@/lib/auth/productionGuards';
import { isProductionRuntime } from '@/lib/safety/production';

export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message: string = 'Forbidden - Admin access required') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

function syntheticAdmin(id: string, email: string, name: string): User {
  return {
    id,
    email,
    emailVerified: null,
    name,
    password: null,
    image: null,
    role: 'ADMIN',
    createdAt: new Date(0),
    updatedAt: new Date(0),
  };
}

/**
 * Require admin authentication for API routes
 * Throws UnauthorizedError if not logged in
 * Throws ForbiddenError if not an admin
 *
 * DISABLE_ADMIN_AUTH is ignored in production.
 */
export async function requireAdmin(): Promise<User> {
  if (isAdminAuthDisabled()) {
    return syntheticAdmin('dev-bypass', 'dev@localhost', 'Dev Bypass');
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new UnauthorizedError();
  }

  if (session.user.id === 'demo-admin') {
    if (!isDemoAdminBypassEnabled()) {
      throw new UnauthorizedError();
    }
    return syntheticAdmin(
      'demo-admin',
      session.user.email || process.env.DEMO_ADMIN_EMAIL || 'demo@localhost',
      'Demo Admin'
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) {
    if (!isProductionRuntime() && session.user.role === 'ADMIN') {
      return syntheticAdmin(
        session.user.id,
        session.user.email || '',
        session.user.name || 'Admin'
      );
    }
    throw new UnauthorizedError('User not found');
  }

  if (user.role !== 'ADMIN') {
    throw new ForbiddenError();
  }

  return user;
}

/**
 * Check if current user is an admin (returns boolean)
 * Use this for conditional rendering/logic
 */
export async function isAdmin(): Promise<boolean> {
  try {
    await requireAdmin();
    return true;
  } catch {
    return false;
  }
}

/**
 * Get current user (admin or customer)
 * Returns null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return null;
    }

    if (session.user.id === 'demo-admin') {
      if (!isDemoAdminBypassEnabled()) return null;
      return syntheticAdmin(
        'demo-admin',
        session.user.email || process.env.DEMO_ADMIN_EMAIL || 'demo@localhost',
        'Demo Admin'
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    return user;
  } catch {
    return null;
  }
}

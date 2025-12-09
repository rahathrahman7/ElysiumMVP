import { getServerSession } from 'next-auth';
import { authOptions } from './config';
import { prisma } from '@/lib/database/prisma';
import { User } from '@prisma/client';

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

/**
 * Require admin authentication for API routes
 * Throws UnauthorizedError if not logged in
 * Throws ForbiddenError if not an admin
 */
export async function requireAdmin(): Promise<User> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new UnauthorizedError();
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) {
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
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return false;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    return user?.role === 'ADMIN';
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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    return user;
  } catch {
    return null;
  }
}

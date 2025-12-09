import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/adminAuth';
import { getDashboardStats } from '@/lib/services/admin';

export async function GET() {
  try {
    // Require admin authentication
    await requireAdmin();

    // Get dashboard stats
    const stats = await getDashboardStats();

    return NextResponse.json(stats);
  } catch (error: any) {
    if (error.name === 'UnauthorizedError') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (error.name === 'ForbiddenError') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/adminAuth';
import { getAllOrders } from '@/lib/services/orders';
import { OrderStatus } from '@prisma/client';

export async function GET(request: Request) {
  try {
    // Require admin authentication
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as OrderStatus | null;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    const orders = await getAllOrders({
      status: status || undefined,
      limit,
      offset,
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    if (error.name === 'UnauthorizedError') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (error.name === 'ForbiddenError') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    console.error('Get admin orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

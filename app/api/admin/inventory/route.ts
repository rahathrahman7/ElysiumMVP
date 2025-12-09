import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/adminAuth';
import { prisma } from '@/lib/database/prisma';
import { updateInventory } from '@/lib/services/inventory';

export async function GET(request: Request) {
  try {
    // Require admin authentication
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const productSlug = searchParams.get('productSlug');

    if (productSlug) {
      const inventory = await prisma.inventory.findMany({
        where: { productSlug },
        orderBy: { lastUpdated: 'desc' }
      });
      return NextResponse.json({ inventory });
    }

    // Get all inventory
    const inventory = await prisma.inventory.findMany({
      orderBy: [
        { productSlug: 'asc' },
        { variantKey: 'asc' }
      ]
    });

    return NextResponse.json({ inventory });
  } catch (error: any) {
    if (error.name === 'UnauthorizedError') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (error.name === 'ForbiddenError') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    console.error('Get admin inventory error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Require admin authentication
    await requireAdmin();

    const body = await request.json();
    const { productSlug, variantKey, stockLevel, lowStockThreshold } = body;

    if (!productSlug || !variantKey) {
      return NextResponse.json(
        { error: 'productSlug and variantKey are required' },
        { status: 400 }
      );
    }

    const inventory = await updateInventory({
      productSlug,
      variantKey,
      stockLevel: stockLevel !== undefined ? parseInt(stockLevel) : undefined,
      lowStockThreshold: lowStockThreshold !== undefined ? parseInt(lowStockThreshold) : undefined,
    });

    return NextResponse.json({ inventory });
  } catch (error: any) {
    if (error.name === 'UnauthorizedError') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (error.name === 'ForbiddenError') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    console.error('Update admin inventory error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

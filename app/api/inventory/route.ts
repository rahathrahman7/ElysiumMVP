import { NextResponse } from 'next/server';
import { getProductInventory, checkAvailability } from '@/lib/services/inventory';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productSlug = searchParams.get('productSlug');
    const variantKey = searchParams.get('variantKey');
    const quantity = searchParams.get('quantity');

    if (!productSlug) {
      return NextResponse.json(
        { error: 'productSlug is required' },
        { status: 400 }
      );
    }

    // Check specific variant availability
    if (variantKey && quantity) {
      const result = await checkAvailability(
        productSlug,
        variantKey,
        parseInt(quantity)
      );
      return NextResponse.json(result);
    }

    // Get all inventory for product
    const inventory = await getProductInventory(productSlug);
    return NextResponse.json({ inventory });
  } catch (error) {
    console.error('Get inventory error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

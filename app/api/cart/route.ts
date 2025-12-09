import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { getCart, addToCart, clearCart } from '@/lib/services/cart';
import { z } from 'zod';

const addToCartSchema = z.object({
  productSlug: z.string(),
  configuration: z.object({
    metal: z.string(),
    size: z.string(),
    diamond: z.object({
      shape: z.string(),
      carat: z.number(),
      color: z.string(),
      clarity: z.string(),
    }).optional(),
    engraving: z.string().optional(),
  }),
  quantity: z.number().int().min(1).default(1),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cartItems = await getCart(session.user.id);

    return NextResponse.json({ items: cartItems });
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productSlug, configuration, quantity } = addToCartSchema.parse(body);

    const cartItem = await addToCart(
      session.user.id,
      productSlug,
      configuration,
      quantity
    );

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Add to cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await clearCart(session.user.id);

    return NextResponse.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { updateCartItem, removeFromCart } from '@/lib/services/cart';
import { z } from 'zod';

const updateCartSchema = z.object({
  quantity: z.number().int().min(0),
});

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { quantity } = updateCartSchema.parse(body);

    const cartItem = await updateCartItem(params.id, session.user.id, quantity);

    if (!cartItem) {
      return NextResponse.json({ message: 'Item removed from cart' });
    }

    return NextResponse.json(cartItem);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === 'Cart item not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    console.error('Update cart item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await removeFromCart(params.id, session.user.id);

    return NextResponse.json({ message: 'Item removed from cart' });
  } catch (error) {
    if (error instanceof Error && error.message === 'Cart item not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    console.error('Remove cart item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

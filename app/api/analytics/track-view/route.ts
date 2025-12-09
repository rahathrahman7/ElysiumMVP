import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { trackProductView } from '@/lib/services/analytics';
import { z } from 'zod';

const trackViewSchema = z.object({
  productSlug: z.string(),
  sessionId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { productSlug, sessionId } = trackViewSchema.parse(body);

    await trackProductView(
      productSlug,
      session?.user?.id,
      sessionId
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Track view error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

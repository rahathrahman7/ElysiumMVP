import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { getRecentlyViewed, getRecentlyViewedBySession } from '@/lib/services/analytics';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const limit = parseInt(searchParams.get('limit') || '10');

    const session = await getServerSession(authOptions);

    let productSlugs: string[];

    if (session?.user?.id) {
      productSlugs = await getRecentlyViewed(session.user.id, limit);
    } else if (sessionId) {
      productSlugs = await getRecentlyViewedBySession(sessionId, limit);
    } else {
      return NextResponse.json({ products: [] });
    }

    return NextResponse.json({ products: productSlugs });
  } catch (error) {
    console.error('Get recently viewed error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

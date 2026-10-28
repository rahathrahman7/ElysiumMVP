import { NextRequest, NextResponse } from 'next/server';
import { nivodaAPI } from '@/lib/nivoda';
import { isProductionRuntime } from '@/lib/safety/production';

/**
 * Debug-only Nivoda connectivity probe. Disabled whenever NODE_ENV or
 * VERCEL_ENV is production so it cannot leak credentials or live inventory
 * on the public site. Use `next dev` (or a non-production runtime) instead.
 */
function notFoundInProduction() {
  if (!isProductionRuntime()) return null;
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function POST(request: NextRequest) {
  const blocked = notFoundInProduction();
  if (blocked) return blocked;

  try {
    const body = await request.json();
    const { username, password, testQuery = false } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Set credentials
    nivodaAPI.setCredentials(username, password);

    if (testQuery) {
      // Test with a simple diamond search
      const diamonds = await nivodaAPI.searchDiamonds({
        shapes: ['ROUND'],
        caratFrom: 1.0,
        caratTo: 2.0,
        colors: ['D', 'E', 'F'],
        clarities: ['VS1', 'VVS2'],
      });

      return NextResponse.json({
        success: true,
        message: 'Nivoda API connection successful',
        diamondCount: diamonds.length,
        sampleDiamonds: diamonds.slice(0, 3), // Return first 3 as samples
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Credentials set successfully. Use testQuery: true to test API call.',
    });

  } catch (error) {
    console.error('Nivoda API test error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to connect to Nivoda API',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint for simple health check
export async function GET() {
  const blocked = notFoundInProduction();
  if (blocked) return blocked;

  return NextResponse.json({
    message: 'Nivoda API test endpoint. Use POST with username/password to test connection.',
    endpoints: {
      production: 'https://integrations.nivoda.net/api/diamonds',
      staging: 'https://intg-customer-staging.nivodaapi.net/api/diamonds'
    }
  });
}

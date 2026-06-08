import { NextRequest, NextResponse } from 'next/server';

// VULNERABILITY: SSRF (Server-Side Request Forgery)
// The stockCheck endpoint makes a server-side HTTP request
// to a user-supplied URL without validation.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stockApi } = body;

    if (!stockApi) {
      return NextResponse.json(
        { error: 'stockApi URL is required' },
        { status: 400 }
      );
    }

    // VULNERABLE: No validation of the stockApi URL
    // An attacker can supply any URL, including internal ones
    try {
      const response = await fetch(stockApi, {
        method: 'GET',
        headers: {
          'User-Agent': 'ShopZone-StockChecker/1.0',
        },
        signal: AbortSignal.timeout(10000),
      });

      const text = await response.text();

      return NextResponse.json({
        status: response.status,
        body: text,
        url: stockApi,
      });
    } catch (fetchError: any) {
      return NextResponse.json({
        error: 'Stock service unavailable',
      }, { status: 502 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', detail: error.message },
      { status: 500 }
    );
  }
}

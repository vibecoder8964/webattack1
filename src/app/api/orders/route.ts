import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Orders API - returns orders for a user
// IDOR VULNERABILITY: accepts an optional userId query parameter that overrides the session user
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session_id')?.value;
    if (!sessionId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Verify session
    const sessions = await db.$queryRawUnsafe(
      `SELECT * FROM sessions WHERE id = '${sessionId}'`
    ) as any[];

    if (sessions.length === 0) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // VULNERABLE: Uses user-controllable userId parameter directly
    // If userId is provided in the query string, it overrides the session user
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('userId') || String(sessions[0].user_id);

    const orders = await db.$queryRawUnsafe(
      `SELECT * FROM orders WHERE user_id = ${targetUserId} ORDER BY created_at DESC`
    ) as any[];

    const formatted = orders.map((o: any) => ({
      id: o.id,
      userId: o.user_id,
      status: o.status,
      total: o.total,
      items: JSON.parse(o.items),
      shippingAddr: o.shipping_addr,
      createdAt: o.created_at,
    }));

    return NextResponse.json({ orders: formatted });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', detail: error.message },
      { status: 500 }
    );
  }
}

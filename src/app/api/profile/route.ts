import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// VULNERABILITY: IDOR (Insecure Direct Object Reference)
// The profile endpoint returns user data based on the `id` parameter
// without checking if the requesting user is authorized to view that data.
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

    const session = sessions[0];

    // VULNERABLE: Uses user-controllable `id` parameter directly
    const { searchParams } = new URL(request.url);
    const targetId = searchParams.get('id') || String(session.user_id);

    const users = await db.$queryRawUnsafe(
      `SELECT * FROM users WHERE id = ${targetId}`
    ) as any[];

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = users[0];

    // Return sensitive user data including blog URL
    return NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      blogUrl: user.blog_url,
      twoFaEnabled: !!user.two_fa_enabled,
      memberSince: user.created_at,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', detail: error.message },
      { status: 500 }
    );
  }
}

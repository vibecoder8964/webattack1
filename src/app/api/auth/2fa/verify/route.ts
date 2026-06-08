import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// VULNERABILITY: 2FA Bypass
// The 2FA verification sets a cookie, but the admin dashboard
// only checks the cookie value, not the server-side session.
// A player can set 2fa_verified=true cookie directly.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    const userId = request.cookies.get('user_id')?.value;
    const sessionId = request.cookies.get('session_id')?.value;

    if (!sessionId || !userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get user's 2FA secret
    const users = await db.$queryRawUnsafe(
      `SELECT * FROM users WHERE id = ${userId}`
    ) as any[];

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = users[0];

    if (String(code) !== String(user.two_fa_secret)) {
      return NextResponse.json(
        { error: 'Invalid 2FA code' },
        { status: 401 }
      );
    }

    // Update session
    await db.$executeRawUnsafe(
      `UPDATE sessions SET two_fa_verified = 1 WHERE id = '${sessionId}'`
    );

    const response = NextResponse.json({
      success: true,
      message: '2FA verification successful',
    });

    // Set the 2fa_verified cookie to true
    response.cookies.set('2fa_verified', 'true', { httpOnly: false, path: '/' });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', detail: error.message },
      { status: 500 }
    );
  }
}

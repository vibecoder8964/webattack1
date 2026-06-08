import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, email } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check if username already exists (USERNAME ENUMERATION)
    const existing = await db.$queryRawUnsafe(
      `SELECT * FROM users WHERE username = '${username}'`
    ) as any[];

    if (existing.length > 0) {
      return NextResponse.json(
        { error: `Username '${username}' is already taken` },
        { status: 409 }
      );
    }

    await db.$executeRawUnsafe(
      `INSERT INTO users (username, password, email, role, two_fa_enabled, created_at) VALUES ('${username}', '${password}', ${email ? `'${email}'` : 'NULL'}, 'customer', 0, datetime('now'))`
    );

    // Get the newly created user
    const users = await db.$queryRawUnsafe(
      `SELECT * FROM users WHERE username = '${username}'`
    ) as any[];

    const user = users[0];
    const sessionId = crypto.randomUUID();

    await db.$executeRawUnsafe(
      `INSERT INTO sessions (id, user_id, two_fa_verified, is_admin, created_at) VALUES ('${sessionId}', ${user.id}, 0, 0, datetime('now'))`
    );

    const response = NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: { id: user.id, username: user.username, role: 'customer' },
    });

    response.cookies.set('session_id', sessionId, { httpOnly: false, path: '/' });
    response.cookies.set('role', 'customer', { httpOnly: false, path: '/' });
    response.cookies.set('2fa_verified', 'true', { httpOnly: false, path: '/' });
    response.cookies.set('user_id', String(user.id), { httpOnly: false, path: '/' });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', detail: error.message },
      { status: 500 }
    );
  }
}

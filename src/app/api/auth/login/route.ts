import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// VULNERABILITY: SQL Injection
// The login endpoint uses Prisma's $queryRawUnsafe with string interpolation,
// making it vulnerable to SQL injection attacks.
// TODO: implement rate limiting
export async function POST(request: NextRequest) {
  try {
    // Small delay to slow brute-force (reduced for stability)
    await new Promise(resolve => setTimeout(resolve, 100));

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // VULNERABLE: Direct string interpolation in SQL query via $queryRawUnsafe
    // This allows SQL injection via the username parameter
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    let result;
    try {
      result = await db.$queryRawUnsafe(query) as any[];
    } catch (sqlError: any) {
      // Exposing SQL errors helps attackers debug their injection
      return NextResponse.json(
        { error: 'Database query error', detail: sqlError.message },
        { status: 500 }
      );
    }

    if (!result || result.length === 0) {
      // USERNAME ENUMERATION VULNERABILITY:
      // Different messages for "user not found" vs "wrong password"
      try {
        const userCheck = await db.$queryRawUnsafe(
          `SELECT * FROM users WHERE username = '${username}'`
        ) as any[];
        if (userCheck.length === 0) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 401 }
          );
        } else {
          return NextResponse.json(
            { error: 'Invalid password' },
            { status: 401 }
          );
        }
      } catch {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }
    }

    const user = result[0];
    const sessionId = crypto.randomUUID();

    // Create session using parameterized query for safety
    await db.$executeRawUnsafe(
      `INSERT INTO sessions (id, user_id, two_fa_verified, is_admin, created_at) VALUES ('${sessionId}', ${user.id}, 0, ${user.role === 'admin' ? 1 : 0}, datetime('now'))`
    );

    const response = NextResponse.json({
      success: true,
      message: user.two_fa_enabled ? '2FA verification required' : 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        twoFaEnabled: !!user.two_fa_enabled,
      },
      requires2FA: !!user.two_fa_enabled,
    });

    // Set cookies - VULNERABILITY: role and 2FA status stored in client-side cookies
    response.cookies.set('session_id', sessionId, { httpOnly: false, path: '/' });
    response.cookies.set('role', user.role, { httpOnly: false, path: '/' });
    response.cookies.set('2fa_verified', user.two_fa_enabled ? 'false' : 'true', { httpOnly: false, path: '/' });
    response.cookies.set('user_id', String(user.id), { httpOnly: false, path: '/' });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', detail: error.message },
      { status: 500 }
    );
  }
}

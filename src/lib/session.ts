import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export interface SessionUser {
  id: number;
  username: string;
  role: string;
  email: string | null;
  blogUrl: string | null;
  twoFaEnabled: number;
  twoFaVerified: boolean;
  isAdmin: boolean;
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = cookies();
  const sessionId = cookieStore.get('session_id')?.value;
  const roleCookie = cookieStore.get('role')?.value;
  const twoFaCookie = cookieStore.get('2fa_verified')?.value;

  if (!sessionId) return null;

  try {
    const sessions = await db.$queryRawUnsafe(`SELECT * FROM sessions WHERE id = '${sessionId}'`) as any[];
    if (!sessions || sessions.length === 0) return null;

    const session = sessions[0];
    const users = await db.$queryRawUnsafe(`SELECT * FROM users WHERE id = ${session.user_id}`) as any[];
    if (!users || users.length === 0) return null;

    const user = users[0];

    return {
      id: user.id,
      username: user.username,
      role: roleCookie || user.role, // VULNERABILITY: trusts cookie over database for role
      email: user.email,
      blogUrl: user.blog_url,
      twoFaEnabled: user.two_fa_enabled,
      twoFaVerified: twoFaCookie === 'true', // VULNERABILITY: trusts cookie for 2FA status
      isAdmin: roleCookie === 'admin' || user.role === 'admin',
    };
  } catch (e) {
    return null;
  }
}

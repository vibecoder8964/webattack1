import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';

// VULNERABILITY: OS Command Injection
// The diagnostic endpoint executes system commands based on
// user-supplied input without proper sanitization.
export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session_id')?.value;
    const role = request.cookies.get('role')?.value;
    const twoFaVerified = request.cookies.get('2fa_verified')?.value;

    if (!sessionId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // VULNERABILITY: Access control based on client-side cookies
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // VULNERABILITY: 2FA check based on cookie value
    if (twoFaVerified !== 'true') {
      return NextResponse.json({ error: '2FA verification required' }, { status: 403 });
    }

    const body = await request.json();
    const { host } = body;

    if (!host) {
      return NextResponse.json({ error: 'Host parameter is required' }, { status: 400 });
    }

    // VULNERABLE: Direct string interpolation in shell command
    // An attacker can inject commands using ; | && || ` etc.
    const command = `ping -c 1 ${host}`;

    return new Promise((resolve) => {
      exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
        resolve(NextResponse.json({
          command: `ping -c 1 <host>`,
          output: stdout || stderr,
          error: error ? error.message : null,
          exitCode: error ? error.code : 0,
        }));
      });
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', detail: error.message },
      { status: 500 }
    );
  }
}

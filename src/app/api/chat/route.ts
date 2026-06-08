import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Chat API - returns and creates chat messages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId query parameter is required' },
        { status: 400 }
      );
    }

    const messages = await db.$queryRawUnsafe(
      `SELECT cm.id, cm.session_id, cm.user_id, cm.sender, cm.message, cm.created_at, u.username FROM chat_messages cm LEFT JOIN users u ON cm.user_id = u.id WHERE cm.session_id = '${sessionId.replace(/'/g, "''")}' ORDER BY cm.created_at ASC`
    ) as any[];

    const formatted = messages.map((m: any) => ({
      id: m.id,
      sessionId: m.session_id,
      userId: m.user_id,
      sender: m.sender,
      message: m.message,
      username: m.username,
      createdAt: m.created_at,
    }));

    return NextResponse.json({ messages: formatted });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', detail: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session_id')?.value;
    if (!sessionId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { chatSessionId, message } = body;

    if (!chatSessionId || !message) {
      return NextResponse.json(
        { error: 'chatSessionId and message are required' },
        { status: 400 }
      );
    }

    const userId = request.cookies.get('user_id')?.value;

    await db.$executeRawUnsafe(
      `INSERT INTO chat_messages (session_id, user_id, sender, message, created_at) VALUES ('${chatSessionId.replace(/'/g, "''")}', ${userId || 'NULL'}, 'customer', '${message.replace(/'/g, "''")}', datetime('now'))`
    );

    return NextResponse.json({ success: true, message: 'Message sent' });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', detail: error.message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// VULNERABILITY 6a: File Upload - Content-Type bypass
// The upload endpoint only checks the Content-Type header, not the actual file content or extension.
export async function POST(request: NextRequest) {
  try {
    const role = request.cookies.get('role')?.value;
    const sessionId = request.cookies.get('session_id')?.value;

    if (!sessionId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // VULNERABLE: Only checks Content-Type header, not actual file content
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      return NextResponse.json(
        { error: `File type not allowed. Only images accepted. Got: ${file.type}` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'ctf-data');
    const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
    
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const filePath = path.join(UPLOAD_DIR, file.name);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      filename: file.name,
      path: `/uploads/${file.name}`,
      size: buffer.length,
      type: file.type
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', detail: error.message },
      { status: 500 }
    );
  }
}

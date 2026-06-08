import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// VULNERABILITY: Path Traversal
// The loadImage endpoint reads files from the server's filesystem
// based on user-supplied filename without proper sanitization.
// Resolve ctf-data directory - supports DATA_DIR env var for production deployment
const CTF_DATA_DIR = process.env.DATA_DIR
  ? path.join(process.env.DATA_DIR, 'ctf-data')
  : path.join(process.cwd(), 'ctf-data');
const IMAGES_DIR = path.join(CTF_DATA_DIR, 'var', 'www', 'images');

// Simulated restricted paths - the web server runs as www-data and cannot access these
const RESTRICTED_PATHS = [
  '/root/',
  '/home/root/',
  path.join(CTF_DATA_DIR, 'root').toLowerCase(),
];

function isRestricted(filePath: string): boolean {
  const resolved = path.resolve(filePath).toLowerCase();
  return RESTRICTED_PATHS.some(rp => resolved.includes(rp));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    // VULNERABLE: No sanitization of the filename parameter
    // An attacker can use ../ to traverse directories
    const filePath = path.join(IMAGES_DIR, filename);

    // Simulate file permission check
    // The web server runs as www-data and cannot read files in /root/
    if (isRestricted(filePath)) {
      return NextResponse.json(
        { error: 'Permission denied', detail: `www-data cannot read: ${filePath}`, path: filePath },
        { status: 403 }
      );
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'File not found', path: filePath },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(filePath);

    // Determine content type based on extension
    const ext = path.extname(filename).toLowerCase();
    const contentTypes: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.txt': 'text/plain',
      '.ini': 'text/plain',
      '.conf': 'text/plain',
      '.cfg': 'text/plain',
    };

    const contentType = contentTypes[ext] || 'application/octet-stream';

    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${path.basename(filename)}"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', detail: error.message },
      { status: 500 }
    );
  }
}

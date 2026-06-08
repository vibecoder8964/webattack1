import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Resolve database path from DATABASE_URL env var or fall back to cwd-relative path
function resolveDbPath(): string {
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    // Handle file: URLs - convert to filesystem path
    if (dbUrl.startsWith('file:')) {
      const rawPath = dbUrl.replace(/^file:/, '');
      // If it's a relative path, resolve relative to a sensible base
      if (!path.isAbsolute(rawPath)) {
        // Try relative to the project data directory first
        const dataDir = process.env.DATA_DIR || process.cwd();
        const resolved = path.resolve(dataDir, rawPath);
        if (fs.existsSync(resolved)) {
          return resolved;
        }
        // Try relative to cwd
        const cwdResolved = path.resolve(process.cwd(), rawPath);
        if (fs.existsSync(cwdResolved)) {
          return cwdResolved;
        }
        // Fall back to the data dir resolution
        return resolved;
      }
      return rawPath;
    }
    return dbUrl;
  }
  // Default: look for prisma/ctf.db relative to cwd
  return path.join(process.cwd(), 'prisma', 'ctf.db');
}

const dbPath = resolveDbPath();
console.log(`[db-raw] Using database at: ${dbPath}`);

const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

export default db;

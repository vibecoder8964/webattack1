import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Products API - supports category filtering
// VULNERABILITY: SQL Injection in category parameter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let products;
    if (category) {
      // VULNERABLE: String interpolation in SQL query
      const query = `SELECT id, name, description, price, category, image, stock FROM products WHERE category = '${category}' AND released = 1`;
      products = await db.$queryRawUnsafe(query) as any[];
    } else {
      products = await db.$queryRawUnsafe('SELECT id, name, description, price, category, image, stock FROM products WHERE released = 1') as any[];
    }

    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', detail: error.message },
      { status: 500 }
    );
  }
}

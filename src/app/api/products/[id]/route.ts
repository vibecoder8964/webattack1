import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Single product API - fetch by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const products = await db.$queryRawUnsafe(
      `SELECT id, name, description, price, category, image, stock FROM products WHERE id = ${productId}`
    ) as any[];

    if (products.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Also fetch related products (same category, different product)
    const category = products[0].category;
    const related = await db.$queryRawUnsafe(
      `SELECT id, name, description, price, category, image, stock FROM products WHERE category = '${category}' AND id != ${productId} AND released = 1 LIMIT 4`
    ) as any[];

    return NextResponse.json({
      product: products[0],
      relatedProducts: related,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', detail: error.message },
      { status: 500 }
    );
  }
}

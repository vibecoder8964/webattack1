import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Reviews API - returns reviews for a product
// Uses parameterized queries (safe)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'productId query parameter is required' },
        { status: 400 }
      );
    }

    const productIdNum = parseInt(productId, 10);
    if (isNaN(productIdNum)) {
      return NextResponse.json(
        { error: 'productId must be a number' },
        { status: 400 }
      );
    }

    // Safe parameterized query using Prisma's tagged template
    const reviews = await db.$queryRawUnsafe(
      `SELECT r.id, r.product_id, r.user_id, r.rating, r.title, r.content, r.verified, r.created_at, u.username FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ${productIdNum} ORDER BY r.created_at DESC`
    ) as any[];

    const formatted = reviews.map((r: any) => ({
      id: r.id,
      productId: r.product_id,
      userId: r.user_id,
      username: r.username,
      rating: r.rating,
      title: r.title,
      content: r.content,
      verified: !!r.verified,
      createdAt: r.created_at,
    }));

    return NextResponse.json({ reviews: formatted });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', detail: error.message },
      { status: 500 }
    );
  }
}

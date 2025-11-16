import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/products/slug/[slug] - Get product by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const result = await query(
      `SELECT p.*, a.name as artist_name, a.slug as artist_slug
       FROM products p
       LEFT JOIN artists a ON p.artist_id = a.id
       WHERE p.slug = $1`,
      [params.slug]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product: result.rows[0] });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}


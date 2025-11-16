import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().optional().nullable(),
  price: z.number().positive(),
  category: z.enum(['shirt', 'sticker', 'digital', 'other']),
  product_type: z.enum(['physical', 'digital', 'bundle']).default('physical'),
  artist_id: z.string().uuid().optional().nullable(),
  featured: z.boolean().default(false),
  in_stock: z.boolean().default(true),
  inventory_count: z.number().int().optional().nullable(),
  download_url: z.string().url().optional().nullable(),
  download_limit: z.number().int().optional().nullable(),
  expiry_days: z.number().int().optional().nullable(),
});

// GET /api/products - List products
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const product_type = searchParams.get('product_type');
    const artist_id = searchParams.get('artist_id');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let queryText = `
      SELECT p.*, a.name as artist_name, a.slug as artist_slug
      FROM products p
      LEFT JOIN artists a ON p.artist_id = a.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      queryText += ` AND p.category = $${paramCount}`;
      params.push(category);
    }

    if (product_type) {
      paramCount++;
      queryText += ` AND p.product_type = $${paramCount}`;
      params.push(product_type);
    }

    if (artist_id) {
      paramCount++;
      queryText += ` AND p.artist_id = $${paramCount}`;
      params.push(artist_id);
    }

    if (featured === 'true') {
      paramCount++;
      queryText += ` AND p.featured = $${paramCount}`;
      params.push(true);
    }

    queryText += ` ORDER BY p.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    return NextResponse.json({ products: result.rows, count: result.rowCount });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = productSchema.parse(body);

    const result = await query(
      `INSERT INTO products (name, slug, description, price, category, product_type, artist_id, featured, in_stock, inventory_count, download_url, download_limit, expiry_days)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [
        validated.name,
        validated.slug,
        validated.description || null,
        validated.price,
        validated.category,
        validated.product_type,
        validated.artist_id || null,
        validated.featured,
        validated.in_stock,
        validated.inventory_count || null,
        validated.download_url || null,
        validated.download_limit || null,
        validated.expiry_days || null,
      ]
    );

    return NextResponse.json({ product: result.rows[0] }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const updateProductSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).optional(),
  description: z.string().optional().nullable(),
  price: z.number().positive().optional(),
  category: z.enum(['shirt', 'sticker', 'digital', 'other']).optional(),
  product_type: z.enum(['physical', 'digital', 'bundle']).optional(),
  artist_id: z.string().uuid().optional().nullable(),
  featured: z.boolean().optional(),
  in_stock: z.boolean().optional(),
  inventory_count: z.number().int().optional().nullable(),
  download_url: z.string().url().optional().nullable(),
  download_limit: z.number().int().optional().nullable(),
  expiry_days: z.number().int().optional().nullable(),
});

// GET /api/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query(
      `SELECT p.*, a.name as artist_name, a.slug as artist_slug
       FROM products p
       LEFT JOIN artists a ON p.artist_id = a.id
       WHERE p.id = $1`,
      [params.id]
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

// PUT /api/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = updateProductSchema.parse(body);

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    Object.entries(validated).forEach(([key, value]) => {
      if (value !== undefined) {
        paramCount++;
        updates.push(`${key} = $${paramCount}`);
        values.push(value);
      }
    });

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    paramCount++;
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(params.id);

    const result = await query(
      `UPDATE products SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product: result.rows[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query('DELETE FROM products WHERE id = $1 RETURNING id', [
      params.id,
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}


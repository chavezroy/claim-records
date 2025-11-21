import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const productImageSchema = z.object({
  media_ids: z.array(z.string().uuid()).min(1),
});

// POST /api/products/[id]/images - Add images to product
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = productImageSchema.parse(body);

    // Verify product exists
    const productCheck = await query('SELECT id FROM products WHERE id = $1', [params.id]);
    if (productCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Insert product images
    const results = [];
    for (let i = 0; i < validated.media_ids.length; i++) {
      const mediaId = validated.media_ids[i];
      
      // Verify media exists
      const mediaCheck = await query('SELECT id FROM media WHERE id = $1', [mediaId]);
      if (mediaCheck.rows.length === 0) {
        continue; // Skip invalid media IDs
      }

      // Check if image already associated
      const existing = await query(
        'SELECT id FROM product_images WHERE product_id = $1 AND media_id = $2',
        [params.id, mediaId]
      );

      if (existing.rows.length > 0) {
        continue; // Skip if already associated
      }

      const result = await query(
        `INSERT INTO product_images (product_id, media_id, display_order)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [params.id, mediaId, i]
      );

      if (result.rows.length > 0) {
        results.push(result.rows[0]);
      }
    }

    return NextResponse.json({ images: results, count: results.length }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error adding product images:', error);
    return NextResponse.json(
      { error: 'Failed to add product images' },
      { status: 500 }
    );
  }
}

// GET /api/products/[id]/images - Get product images
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query(
      `SELECT pi.*, m.file_path, m.mime_type, m.alt_text
       FROM product_images pi
       JOIN media m ON pi.media_id = m.id
       WHERE pi.product_id = $1
       ORDER BY pi.display_order ASC`,
      [params.id]
    );

    return NextResponse.json({ images: result.rows });
  } catch (error) {
    console.error('Error fetching product images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product images' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id]/images - Remove image from product (imageId in query param)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imageId = searchParams.get('imageId');
    
    if (!imageId) {
      return NextResponse.json({ error: 'imageId query parameter required' }, { status: 400 });
    }

    const result = await query(
      'DELETE FROM product_images WHERE id = $1 AND product_id = $2 RETURNING id',
      [imageId, params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Product image not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Image removed successfully' });
  } catch (error) {
    console.error('Error removing product image:', error);
    return NextResponse.json(
      { error: 'Failed to remove product image' },
      { status: 500 }
    );
  }
}


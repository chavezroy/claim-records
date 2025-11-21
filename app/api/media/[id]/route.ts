import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const updateMediaSchema = z.object({
  original_filename: z.string().min(1).max(500).optional(),
  alt_text: z.string().nullable().optional(),
});

// GET /api/media/[id] - Get single media item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query('SELECT * FROM media WHERE id = $1', [params.id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    return NextResponse.json({ media: result.rows[0] });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
}

// PUT /api/media/[id] - Update media metadata
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = updateMediaSchema.parse(body);

    // Check if media exists
    const mediaCheck = await query('SELECT id FROM media WHERE id = $1', [params.id]);
    if (mediaCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Build update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    if (validated.original_filename !== undefined) {
      paramCount++;
      updates.push(`original_filename = $${paramCount}`);
      values.push(validated.original_filename);
    }

    if (validated.alt_text !== undefined) {
      paramCount++;
      updates.push(`alt_text = $${paramCount}`);
      values.push(validated.alt_text);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    paramCount++;
    values.push(params.id);

    const result = await query(
      `UPDATE media SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return NextResponse.json({ media: result.rows[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error updating media:', error);
    return NextResponse.json(
      { error: 'Failed to update media' },
      { status: 500 }
    );
  }
}

// DELETE /api/media/[id] - Delete media item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get media info before deleting
    const mediaResult = await query('SELECT * FROM media WHERE id = $1', [params.id]);
    
    if (mediaResult.rows.length === 0) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    const media = mediaResult.rows[0];

    // Check if media is in use
    const productImagesCheck = await query(
      'SELECT COUNT(*) as count FROM product_images WHERE media_id = $1',
      [params.id]
    );
    const artistMediaCheck = await query(
      'SELECT COUNT(*) as count FROM artist_media WHERE media_id = $1',
      [params.id]
    );

    const productImageCount = parseInt(productImagesCheck.rows[0].count);
    const artistMediaCount = parseInt(artistMediaCheck.rows[0].count);
    const totalUsage = productImageCount + artistMediaCount;

    // Delete from database (CASCADE will handle product_images and artist_media)
    await query('DELETE FROM media WHERE id = $1', [params.id]);

    // Delete physical file
    if (media.file_path && media.file_path.startsWith('/uploads/')) {
      const filePath = join(process.cwd(), 'public', media.file_path);
      if (existsSync(filePath)) {
        try {
          await unlink(filePath);
        } catch (fileError) {
          console.error('Error deleting file:', fileError);
          // Continue even if file deletion fails (file might not exist)
        }
      }
    }

    return NextResponse.json({
      message: 'Media deleted successfully',
      wasInUse: totalUsage > 0,
      usageCount: totalUsage,
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    );
  }
}


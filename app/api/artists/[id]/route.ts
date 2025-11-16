import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const updateArtistSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).optional(),
  bio: z.string().optional().nullable(),
  image: z.string().url().optional().nullable(),
  profile_image: z.string().url().optional().nullable(),
  instagram_url: z.string().url().optional().nullable(),
  twitter_url: z.string().url().optional().nullable(),
  facebook_url: z.string().url().optional().nullable(),
  youtube_url: z.string().url().optional().nullable(),
  featured: z.boolean().optional(),
});

// GET /api/artists/[id] - Get single artist
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query('SELECT * FROM artists WHERE id = $1', [
      params.id,
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    return NextResponse.json({ artist: result.rows[0] });
  } catch (error) {
    console.error('Error fetching artist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artist' },
      { status: 500 }
    );
  }
}

// PUT /api/artists/[id] - Update artist
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = updateArtistSchema.parse(body);

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
      `UPDATE artists SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    return NextResponse.json({ artist: result.rows[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error updating artist:', error);
    return NextResponse.json(
      { error: 'Failed to update artist' },
      { status: 500 }
    );
  }
}

// DELETE /api/artists/[id] - Delete artist
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query('DELETE FROM artists WHERE id = $1 RETURNING id', [
      params.id,
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Artist deleted successfully' });
  } catch (error) {
    console.error('Error deleting artist:', error);
    return NextResponse.json(
      { error: 'Failed to delete artist' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/artists/slug/[slug] - Get artist by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const result = await query('SELECT * FROM artists WHERE slug = $1', [
      params.slug,
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


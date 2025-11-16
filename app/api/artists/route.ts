import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const artistSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  bio: z.string().optional().nullable(),
  image: z.string().url().optional().nullable(),
  profile_image: z.string().url().optional().nullable(),
  instagram_url: z.string().url().optional().nullable(),
  twitter_url: z.string().url().optional().nullable(),
  facebook_url: z.string().url().optional().nullable(),
  youtube_url: z.string().url().optional().nullable(),
  featured: z.boolean().default(false),
});

// GET /api/artists - List artists
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let queryText = 'SELECT * FROM artists WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (featured === 'true') {
      paramCount++;
      queryText += ` AND featured = $${paramCount}`;
      params.push(true);
    }

    queryText += ` ORDER BY name ASC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    return NextResponse.json({ artists: result.rows, count: result.rowCount });
  } catch (error) {
    console.error('Error fetching artists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artists' },
      { status: 500 }
    );
  }
}

// POST /api/artists - Create artist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = artistSchema.parse(body);

    const result = await query(
      `INSERT INTO artists (name, slug, bio, image, profile_image, instagram_url, twitter_url, facebook_url, youtube_url, featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        validated.name,
        validated.slug,
        validated.bio || null,
        validated.image || null,
        validated.profile_image || null,
        validated.instagram_url || null,
        validated.twitter_url || null,
        validated.facebook_url || null,
        validated.youtube_url || null,
        validated.featured,
      ]
    );

    return NextResponse.json({ artist: result.rows[0] }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error creating artist:', error);
    return NextResponse.json(
      { error: 'Failed to create artist' },
      { status: 500 }
    );
  }
}


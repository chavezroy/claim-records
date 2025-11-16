import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const videoSchema = z.object({
  title: z.string().min(1).max(500),
  slug: z.string().min(1).max(500),
  description: z.string().optional().nullable(),
  video_type: z.enum(['youtube', 'vimeo', 'upload']),
  video_url: z.string().url().min(1).max(1000),
  thumbnail_url: z.string().url().optional().nullable(),
  artist_id: z.string().uuid().optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  featured: z.boolean().default(false),
});

// GET /api/videos - List videos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const artist_id = searchParams.get('artist_id');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let queryText = `
      SELECT v.*, a.name as artist_name, a.slug as artist_slug
      FROM videos v
      LEFT JOIN artists a ON v.artist_id = a.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 0;

    if (artist_id) {
      paramCount++;
      queryText += ` AND v.artist_id = $${paramCount}`;
      params.push(artist_id);
    }

    if (category) {
      paramCount++;
      queryText += ` AND v.category = $${paramCount}`;
      params.push(category);
    }

    if (featured === 'true') {
      paramCount++;
      queryText += ` AND v.featured = $${paramCount}`;
      params.push(true);
    }

    queryText += ` ORDER BY v.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    return NextResponse.json({ videos: result.rows, count: result.rowCount });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

// POST /api/videos - Create video
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = videoSchema.parse(body);

    const result = await query(
      `INSERT INTO videos (title, slug, description, video_type, video_url, thumbnail_url, artist_id, category, featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        validated.title,
        validated.slug,
        validated.description || null,
        validated.video_type,
        validated.video_url,
        validated.thumbnail_url || null,
        validated.artist_id || null,
        validated.category || null,
        validated.featured,
      ]
    );

    return NextResponse.json({ video: result.rows[0] }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    );
  }
}


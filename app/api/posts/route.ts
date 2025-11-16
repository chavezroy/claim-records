import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

// Validation schemas
const postSchema = z.object({
  title: z.string().min(1).max(500),
  slug: z.string().min(1).max(500),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1),
  featured_image: z.union([
    z.string().url(),
    z.literal(''),
    z.null()
  ]).optional().nullable().transform(val => val === '' ? null : val),
  author_id: z.union([
    z.string().uuid(),
    z.literal(''),
    z.null()
  ]).optional().nullable().transform(val => val === '' ? null : val),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  featured: z.boolean().default(false),
  meta_title: z.string().max(255).optional().nullable().transform(val => val === '' ? null : val),
  meta_description: z.string().optional().nullable().transform(val => val === '' ? null : val),
  published_at: z.union([
    z.string().datetime(),
    z.literal(''),
    z.null()
  ]).optional().nullable().transform(val => val === '' ? null : val),
});

// GET /api/posts - List posts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let queryText = `
      SELECT p.*, u.name as author_name, u.email as author_email
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      queryText += ` AND p.status = $${paramCount}`;
      params.push(status);
    }

    if (featured === 'true') {
      paramCount++;
      queryText += ` AND p.featured = $${paramCount}`;
      params.push(true);
    }

    queryText += ` ORDER BY p.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    return NextResponse.json({ posts: result.rows, count: result.rowCount });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = postSchema.parse(body);

    const result = await query(
      `INSERT INTO posts (title, slug, excerpt, content, featured_image, author_id, status, featured, meta_title, meta_description, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        validated.title,
        validated.slug,
        validated.excerpt || null,
        validated.content,
        validated.featured_image || null,
        validated.author_id || null,
        validated.status,
        validated.featured,
        validated.meta_title || null,
        validated.meta_description || null,
        validated.published_at ? new Date(validated.published_at) : null,
      ]
    );

    return NextResponse.json({ post: result.rows[0] }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}


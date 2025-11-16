import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const updatePostSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  slug: z.string().min(1).max(500).optional(),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1).optional(),
  featured_image: z.string().url().optional().nullable(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  featured: z.boolean().optional(),
  meta_title: z.string().max(255).optional().nullable(),
  meta_description: z.string().optional().nullable(),
  published_at: z.string().datetime().optional().nullable(),
});

// GET /api/posts/[id] - Get single post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query(
      `SELECT p.*, u.name as author_name, u.email as author_email
       FROM posts p
       LEFT JOIN users u ON p.author_id = u.id
       WHERE p.id = $1`,
      [params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post: result.rows[0] });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[id] - Update post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = updatePostSchema.parse(body);

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    Object.entries(validated).forEach(([key, value]) => {
      if (value !== undefined) {
        paramCount++;
        updates.push(`${key} = $${paramCount}`);
        if (key === 'published_at' && value) {
          values.push(new Date(value as string));
        } else {
          values.push(value);
        }
      }
    });

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    paramCount++;
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(params.id);

    const result = await query(
      `UPDATE posts SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post: result.rows[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id] - Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query('DELETE FROM posts WHERE id = $1 RETURNING id', [
      params.id,
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}


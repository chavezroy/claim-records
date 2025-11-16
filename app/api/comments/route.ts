import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const commentSchema = z.object({
  entity_type: z.enum(['post', 'artist', 'product']),
  entity_id: z.string().uuid(),
  user_id: z.string().uuid().optional().nullable(),
  author_name: z.string().min(1).max(255).optional().nullable(),
  author_email: z.string().email().optional().nullable(),
  content: z.string().min(1),
  parent_id: z.string().uuid().optional().nullable(),
});

// POST /api/comments - Create comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = commentSchema.parse(body);

    // Require either user_id or author_name/email for guest comments
    if (!validated.user_id && (!validated.author_name || !validated.author_email)) {
      return NextResponse.json(
        { error: 'Either user_id or author_name and author_email are required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO comments (entity_type, entity_id, user_id, author_name, author_email, content, parent_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
       RETURNING *`,
      [
        validated.entity_type,
        validated.entity_id,
        validated.user_id || null,
        validated.author_name || null,
        validated.author_email || null,
        validated.content,
        validated.parent_id || null,
      ]
    );

    return NextResponse.json({ comment: result.rows[0] }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}


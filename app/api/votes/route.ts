import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const voteSchema = z.object({
  entity_type: z.enum(['post', 'comment', 'poll']),
  entity_id: z.string().uuid(),
  user_id: z.string().uuid().optional().nullable(),
  session_id: z.string().optional().nullable(),
  vote_type: z.enum(['upvote', 'downvote']).default('upvote'),
});

// POST /api/votes - Create or update vote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = voteSchema.parse(body);

    // Require either user_id or session_id
    if (!validated.user_id && !validated.session_id) {
      return NextResponse.json(
        { error: 'Either user_id or session_id is required' },
        { status: 400 }
      );
    }

    // Check if vote already exists
    const existing = await query(
      `SELECT * FROM votes 
       WHERE entity_type = $1 AND entity_id = $2 
       AND (user_id = $3 OR session_id = $4)`,
      [
        validated.entity_type,
        validated.entity_id,
        validated.user_id || null,
        validated.session_id || null,
      ]
    );

    let result;
    if (existing.rows.length > 0) {
      // Update existing vote
      result = await query(
        `UPDATE votes 
         SET vote_type = $1
         WHERE entity_type = $2 AND entity_id = $3 
         AND (user_id = $4 OR session_id = $5)
         RETURNING *`,
        [
          validated.vote_type,
          validated.entity_type,
          validated.entity_id,
          validated.user_id || null,
          validated.session_id || null,
        ]
      );
    } else {
      // Create new vote
      result = await query(
        `INSERT INTO votes (entity_type, entity_id, user_id, session_id, vote_type)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          validated.entity_type,
          validated.entity_id,
          validated.user_id || null,
          validated.session_id || null,
          validated.vote_type,
        ]
      );
    }

    // Get vote counts
    const countsResult = await query(
      `SELECT 
         COUNT(CASE WHEN vote_type = 'upvote' THEN 1 END) as upvotes,
         COUNT(CASE WHEN vote_type = 'downvote' THEN 1 END) as downvotes
       FROM votes
       WHERE entity_type = $1 AND entity_id = $2`,
      [validated.entity_type, validated.entity_id]
    );

    return NextResponse.json({
      vote: result.rows[0],
      counts: {
        upvotes: parseInt(countsResult.rows[0].upvotes || '0'),
        downvotes: parseInt(countsResult.rows[0].downvotes || '0'),
      },
    }, { status: existing.rows.length > 0 ? 200 : 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error creating vote:', error);
    return NextResponse.json(
      { error: 'Failed to create vote' },
      { status: 500 }
    );
  }
}


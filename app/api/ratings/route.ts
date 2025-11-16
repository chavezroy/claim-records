import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const ratingSchema = z.object({
  entity_type: z.enum(['product', 'artist', 'post']),
  entity_id: z.string().uuid(),
  user_id: z.string().uuid().optional().nullable(),
  rating: z.number().int().min(1).max(5),
});

// POST /api/ratings - Create or update rating
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = ratingSchema.parse(body);

    // Check if rating already exists
    const existing = await query(
      `SELECT * FROM ratings 
       WHERE entity_type = $1 AND entity_id = $2 AND user_id = $3`,
      [validated.entity_type, validated.entity_id, validated.user_id || null]
    );

    let result;
    if (existing.rows.length > 0) {
      // Update existing rating
      result = await query(
        `UPDATE ratings 
         SET rating = $1, updated_at = CURRENT_TIMESTAMP
         WHERE entity_type = $2 AND entity_id = $3 AND user_id = $4
         RETURNING *`,
        [
          validated.rating,
          validated.entity_type,
          validated.entity_id,
          validated.user_id || null,
        ]
      );
    } else {
      // Create new rating
      result = await query(
        `INSERT INTO ratings (entity_type, entity_id, user_id, rating)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [
          validated.entity_type,
          validated.entity_id,
          validated.user_id || null,
          validated.rating,
        ]
      );
    }

    // Calculate average rating
    const avgResult = await query(
      `SELECT AVG(rating) as average_rating, COUNT(*) as rating_count
       FROM ratings
       WHERE entity_type = $1 AND entity_id = $2`,
      [validated.entity_type, validated.entity_id]
    );

    return NextResponse.json({
      rating: result.rows[0],
      average_rating: parseFloat(avgResult.rows[0].average_rating || '0'),
      rating_count: parseInt(avgResult.rows[0].rating_count || '0'),
    }, { status: existing.rows.length > 0 ? 200 : 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating rating:', error);
    return NextResponse.json(
      { error: 'Failed to create rating' },
      { status: 500 }
    );
  }
}


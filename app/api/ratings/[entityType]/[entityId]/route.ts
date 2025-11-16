import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/ratings/[entityType]/[entityId] - Get ratings for entity
export async function GET(
  request: NextRequest,
  { params }: { params: { entityType: string; entityId: string } }
) {
  try {
    const result = await query(
      `SELECT 
         AVG(rating) as average_rating,
         COUNT(*) as rating_count,
         COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star,
         COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
         COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
         COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
         COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star
       FROM ratings
       WHERE entity_type = $1 AND entity_id = $2`,
      [params.entityType, params.entityId]
    );

    const stats = result.rows[0];

    return NextResponse.json({
      average_rating: parseFloat(stats.average_rating || '0'),
      rating_count: parseInt(stats.rating_count || '0'),
      distribution: {
        1: parseInt(stats.one_star || '0'),
        2: parseInt(stats.two_star || '0'),
        3: parseInt(stats.three_star || '0'),
        4: parseInt(stats.four_star || '0'),
        5: parseInt(stats.five_star || '0'),
      },
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ratings' },
      { status: 500 }
    );
  }
}


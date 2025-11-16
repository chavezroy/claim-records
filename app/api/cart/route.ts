import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const cartItemSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().int().positive(),
  variant_info: z.record(z.string(), z.any()).optional().nullable(),
});

const cartSchema = z.object({
  session_id: z.string().optional(),
  user_id: z.string().uuid().optional().nullable(),
  items: z.array(cartItemSchema),
});

// POST /api/cart - Save cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = cartSchema.parse(body);

    const sessionId = validated.session_id || uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiry

    // Check if cart session exists
    const existing = await query(
      'SELECT * FROM cart_sessions WHERE session_id = $1',
      [sessionId]
    );

    if (existing.rows.length > 0) {
      // Update existing cart
      const result = await query(
        `UPDATE cart_sessions 
         SET cart_data = $1, user_id = $2, expires_at = $3, updated_at = CURRENT_TIMESTAMP
         WHERE session_id = $4
         RETURNING *`,
        [JSON.stringify(validated.items), validated.user_id || null, expiresAt, sessionId]
      );

      return NextResponse.json({
        session_id: sessionId,
        cart: result.rows[0],
      });
    } else {
      // Create new cart
      const result = await query(
        `INSERT INTO cart_sessions (session_id, user_id, cart_data, expires_at)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [
          sessionId,
          validated.user_id || null,
          JSON.stringify(validated.items),
          expiresAt,
        ]
      );

      return NextResponse.json({
        session_id: sessionId,
        cart: result.rows[0],
      }, { status: 201 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error saving cart:', error);
    return NextResponse.json(
      { error: 'Failed to save cart' },
      { status: 500 }
    );
  }
}

// GET /api/cart - Get cart
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const session_id = searchParams.get('session_id');
    const user_id = searchParams.get('user_id');

    if (!session_id && !user_id) {
      return NextResponse.json({ error: 'session_id or user_id required' }, { status: 400 });
    }

    let queryText = 'SELECT * FROM cart_sessions WHERE ';
    const params: any[] = [];
    
    if (session_id && user_id) {
      queryText += '(session_id = $1 OR user_id = $2)';
      params.push(session_id, user_id);
    } else if (session_id) {
      queryText += 'session_id = $1';
      params.push(session_id);
    } else {
      queryText += 'user_id = $1';
      params.push(user_id);
    }

    queryText += ' AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)';

    const result = await query(queryText, params);

    if (result.rows.length === 0) {
      return NextResponse.json({ cart: null, items: [] });
    }

    return NextResponse.json({
      cart: result.rows[0],
      items: result.rows[0].cart_data || [],
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}


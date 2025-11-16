import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/comments/[entityType]/[entityId] - Get comments for entity
export async function GET(
  request: NextRequest,
  { params }: { params: { entityType: string; entityId: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'approved'; // Default to approved for public

    const result = await query(
      `SELECT c.*, u.name as user_name, u.email as user_email
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.entity_type = $1 AND c.entity_id = $2 AND c.status = $3
       ORDER BY c.created_at ASC`,
      [params.entityType, params.entityId, status]
    );

    // Organize comments into tree structure (parent/child)
    const comments = result.rows;
    const commentMap = new Map();
    const rootComments: any[] = [];

    // First pass: create map of all comments
    comments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: build tree
    comments.forEach((comment) => {
      const commentWithReplies = commentMap.get(comment.id);
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.replies.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return NextResponse.json({ comments: rootComments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}


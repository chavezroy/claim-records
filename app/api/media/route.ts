import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const mediaSchema = z.object({
  filename: z.string().min(1).max(500),
  original_filename: z.string().min(1).max(500),
  file_path: z.string().min(1).max(1000),
  file_type: z.string().min(1).max(100),
  file_size: z.number().int().optional().nullable(),
  mime_type: z.string().max(100).optional().nullable(),
  width: z.number().int().optional().nullable(),
  height: z.number().int().optional().nullable(),
  alt_text: z.string().optional().nullable(),
  uploaded_by: z.string().uuid().optional().nullable(),
});

// GET /api/media - List media
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const file_type = searchParams.get('file_type');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let queryText = 'SELECT * FROM media WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (file_type) {
      paramCount++;
      queryText += ` AND file_type = $${paramCount}`;
      params.push(file_type);
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    return NextResponse.json({ media: result.rows, count: result.rowCount });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
}

// POST /api/media - Create media entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = mediaSchema.parse(body);

    const result = await query(
      `INSERT INTO media (filename, original_filename, file_path, file_type, file_size, mime_type, width, height, alt_text, uploaded_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        validated.filename,
        validated.original_filename,
        validated.file_path,
        validated.file_type,
        validated.file_size || null,
        validated.mime_type || null,
        validated.width || null,
        validated.height || null,
        validated.alt_text || null,
        validated.uploaded_by || null,
      ]
    );

    return NextResponse.json({ media: result.rows[0] }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error creating media:', error);
    return NextResponse.json(
      { error: 'Failed to create media' },
      { status: 500 }
    );
  }
}


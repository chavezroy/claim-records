import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/artists/[id]/media - Get artist media
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query(
      `SELECT am.*, m.file_path, m.file_url, m.mime_type, m.alt_text
       FROM artist_media am
       LEFT JOIN media m ON am.media_id = m.id
       WHERE am.artist_id = $1
       ORDER BY am.display_order ASC, am.created_at ASC`,
      [params.id]
    );

    // Group by media type
    const grouped = {
      audio: result.rows.filter((m: any) => m.media_type === 'audio'),
      video: result.rows.filter((m: any) => m.media_type === 'video'),
      gallery: result.rows.filter((m: any) => m.media_type === 'gallery' || m.media_type === 'image'),
    };

    return NextResponse.json({ media: grouped });
  } catch (error) {
    console.error('Error fetching artist media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artist media' },
      { status: 500 }
    );
  }
}


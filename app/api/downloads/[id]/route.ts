import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// POST /api/downloads/[id] - Generate download link for order item
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get order item and verify it's a digital product
    const itemResult = await query(
      `SELECT oi.*, o.email, p.product_type, p.download_url, p.download_limit, p.expiry_days
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       JOIN products p ON oi.product_id = p.id
       WHERE oi.id = $1 AND p.product_type = 'digital' AND o.payment_status = 'paid'`,
      [params.id]
    );

    if (itemResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Digital product not found or order not paid' },
        { status: 404 }
      );
    }

    const item = itemResult.rows[0];

    // Check if download already exists
    const existingResult = await query(
      'SELECT * FROM digital_downloads WHERE order_item_id = $1',
      [params.id]
    );

    let download;
    if (existingResult.rows.length > 0) {
      download = existingResult.rows[0];
    } else {
      // Create new download record
      const downloadToken = uuidv4();
      const expiresAt = item.expiry_days
        ? new Date(Date.now() + item.expiry_days * 24 * 60 * 60 * 1000)
        : null;

      const downloadResult = await query(
        `INSERT INTO digital_downloads (order_item_id, product_id, download_token, download_url, max_downloads, expires_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          params.id,
          item.product_id,
          downloadToken,
          item.download_url,
          item.download_limit || null,
          expiresAt,
        ]
      );

      download = downloadResult.rows[0];
    }

    // Check if download is still valid
    if (download.expires_at && new Date(download.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Download link has expired' },
        { status: 410 }
      );
    }

    if (download.max_downloads && download.download_count >= download.max_downloads) {
      return NextResponse.json(
        { error: 'Download limit reached' },
        { status: 410 }
      );
    }

    // Increment download count
    await query(
      'UPDATE digital_downloads SET download_count = download_count + 1 WHERE id = $1',
      [download.id]
    );

    return NextResponse.json({
      download_url: download.download_url,
      download_token: download.download_token,
      expires_at: download.expires_at,
      remaining_downloads: download.max_downloads
        ? download.max_downloads - download.download_count - 1
        : null,
    });
  } catch (error) {
    console.error('Error generating download:', error);
    return NextResponse.json(
      { error: 'Failed to generate download' },
      { status: 500 }
    );
  }
}

// GET /api/downloads/[id] - Get download info
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query(
      `SELECT dd.*, oi.product_name, o.email
       FROM digital_downloads dd
       JOIN order_items oi ON dd.order_item_id = oi.id
       JOIN orders o ON oi.order_id = o.id
       WHERE dd.id = $1`,
      [params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Download not found' }, { status: 404 });
    }

    return NextResponse.json({ download: result.rows[0] });
  } catch (error) {
    console.error('Error fetching download:', error);
    return NextResponse.json(
      { error: 'Failed to fetch download' },
      { status: 500 }
    );
  }
}


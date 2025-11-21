import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { query } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'video/mp4',
  'video/webm',
  'video/ogg',
];

// POST /api/media/upload - Upload file
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const altText = formData.get('alt_text') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type ${file.type} is not allowed` },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const filename = `${timestamp}-${randomString}.${fileExtension}`;
    const filePath = join(uploadsDir, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Determine file type from MIME type
    let fileType = 'other';
    if (file.type.startsWith('image/')) {
      fileType = 'image';
    } else if (file.type.startsWith('audio/')) {
      fileType = 'audio';
    } else if (file.type.startsWith('video/')) {
      fileType = 'video';
    }

    // Get image dimensions if it's an image
    // Note: For production, consider installing 'sharp' package for better image processing
    let width: number | null = null;
    let height: number | null = null;
    
    if (fileType === 'image') {
      try {
        // Try to use sharp if available (optional dependency)
        const sharp = require('sharp');
        const metadata = await sharp(buffer).metadata();
        width = metadata.width || null;
        height = metadata.height || null;
      } catch (err) {
        // If sharp is not available or fails, continue without dimensions
        // Dimensions are optional and can be added later if needed
        console.log('Image dimensions not extracted (sharp not available or failed)');
      }
    }

    // Create public URL path
    const publicPath = `/uploads/${filename}`;

    // Get user ID from session
    const userId = (session.user as any).id || null;

    // Insert into database
    const result = await query(
      `INSERT INTO media (filename, original_filename, file_path, file_type, file_size, mime_type, width, height, alt_text, uploaded_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        filename,
        file.name,
        publicPath,
        fileType,
        file.size,
        file.type,
        width,
        height,
        altText || null,
        userId,
      ]
    );

    return NextResponse.json({ media: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


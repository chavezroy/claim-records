const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes('rds.amazonaws.com') || process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false,
});

async function addImages() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    console.log('🖼️  Adding images to database...\n');

    // Get admin user for uploaded_by
    const userResult = await client.query('SELECT id FROM users WHERE role = $1 LIMIT 1', ['admin']);
    const uploadedBy = userResult.rows.length > 0 ? userResult.rows[0].id : null;

    // 1. Update Artists with profile images
    console.log('👤 Updating artists with profile images...');
    const artistImages = [
      { slug: 'electric-pulse', image: '/img/artist/_commongood.jpg', profile: '/img/artist/profile/main-extrapolate.jpg' },
      { slug: 'midnight-shadows', image: '/img/artist/_belt1.jpg', profile: '/img/artist/profile/main-thebelt.jpg' },
      { slug: 'neon-dreams', image: '/img/artist/_shadeauxx.jpg', profile: '/img/artist/profile/main-extrapolate.jpg' },
      { slug: 'void-walker', image: '/img/artist/_strange.jpg', profile: '/img/artist/_strange.jpg' },
      { slug: 'crystal-echo', image: '/img/artist/_lastgoodbye.jpg', profile: '/img/artist/profile/main-fg.jpg' },
      { slug: 'solar-flare', image: '/img/artist/_shesaved.jpg', profile: '/img/artist/_shesaved.jpg' },
    ];

    for (const artistImg of artistImages) {
      const result = await client.query(
        'UPDATE artists SET image = $1, profile_image = $2 WHERE slug = $3',
        [artistImg.image, artistImg.profile, artistImg.slug]
      );
      if (result.rowCount > 0) {
        console.log(`  ✓ Updated ${artistImg.slug}`);
      }
    }

    // 2. Create media entries and link to products
    console.log('\n🛍️  Adding product images...');
    
    // Get products
    const productsResult = await client.query('SELECT id, slug, name FROM products ORDER BY created_at');
    const products = productsResult.rows;

    // Product images mapping
    const productImageMap = {
      'claim-records-logo-tshirt': '/img/shop/Claim-shirt-white.jpg',
      'electric-pulse-neon-nights-digital': '/img/artist/release/ex-shadeauxx.png',
      'midnight-shadows-eternal-darkness-vinyl': '/img/artist/release/tb-story.png',
      'neon-dreams-city-lights-cd': '/img/artist/release/ex-syncing.png',
      'claim-records-sticker-pack': '/img/shop/featured_logic.png',
      'void-walker-experimental-mixtape': '/img/artist/release/js-strange.png',
    };

    for (const product of products) {
      const imagePath = productImageMap[product.slug];
      if (imagePath) {
        // Create media entry
        const mediaId = uuidv4();
        const filename = path.basename(imagePath);
        
        await client.query(
          `INSERT INTO media (id, filename, original_filename, file_path, file_type, mime_type, uploaded_by, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
           ON CONFLICT DO NOTHING`,
          [
            mediaId,
            filename,
            filename,
            imagePath,
            'image',
            'image/jpeg',
            uploadedBy,
          ]
        );

        // Link to product
        await client.query(
          `INSERT INTO product_images (product_id, media_id, display_order, created_at)
           VALUES ($1, $2, 0, CURRENT_TIMESTAMP)
           ON CONFLICT DO NOTHING`,
          [product.id, mediaId]
        );

        console.log(`  ✓ Added image to ${product.name}`);
      }
    }

    // 3. Update Videos with thumbnails
    console.log('\n🎥 Adding video thumbnails...');
    
    // For YouTube videos, we can generate thumbnail URLs
    // YouTube thumbnail format: https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
    const videosResult = await client.query('SELECT id, slug, video_url, title FROM videos');
    
    for (const video of videosResult.rows) {
      let thumbnailUrl = null;
      
      // Extract YouTube video ID
      if (video.video_url && video.video_url.includes('youtube.com')) {
        const match = video.video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        if (match) {
          const videoId = match[1];
          thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
      }
      
      // Use placeholder for other videos
      if (!thumbnailUrl) {
        thumbnailUrl = '/img/shop_banner.jpg'; // Fallback image
      }

      await client.query(
        'UPDATE videos SET thumbnail_url = $1 WHERE id = $2',
        [thumbnailUrl, video.id]
      );
      console.log(`  ✓ Updated ${video.title}`);
    }

    await client.query('COMMIT');
    console.log('\n✅ Successfully added images to database!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error adding images:', error);
    throw error;
  } finally {
    client.release();
  }
}

addImages()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed to add images:', error);
    process.exit(1);
  })
  .finally(() => {
    pool.end();
  });


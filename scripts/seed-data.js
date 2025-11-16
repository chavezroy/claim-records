const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

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

// Helper function to create slug from name
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper function to generate order number
function generateOrderNumber() {
  return 'CR-' + Date.now().toString().slice(-8) + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
}

async function seedData() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    console.log('🌱 Starting to seed database...\n');

    // Get or create admin user for author_id
    let adminUser;
    const userResult = await client.query('SELECT id FROM users WHERE role = $1 LIMIT 1', ['admin']);
    
    if (userResult.rows.length > 0) {
      adminUser = userResult.rows[0];
      console.log('✓ Using existing admin user');
    } else {
      console.log('⚠️  No admin user found. Please create one first using: node scripts/create-admin.js');
      console.log('   Continuing with NULL author_id for posts...\n');
    }

    const authorId = adminUser ? adminUser.id : null;

    // 1. Create Artists
    console.log('📝 Creating artists...');
    const artists = [
      {
        name: 'Electric Pulse',
        bio: 'Electronic music producer known for high-energy beats and innovative sound design. Based in Los Angeles.',
        slug: 'electric-pulse',
        featured: true,
        instagram_url: 'https://instagram.com/electricpulse',
        twitter_url: 'https://twitter.com/electricpulse',
      },
      {
        name: 'Midnight Shadows',
        bio: 'Dark ambient duo creating atmospheric soundscapes that blend electronic and acoustic elements.',
        slug: 'midnight-shadows',
        featured: true,
        instagram_url: 'https://instagram.com/midnightshadows',
        youtube_url: 'https://youtube.com/@midnightshadows',
      },
      {
        name: 'Neon Dreams',
        bio: 'Synth-pop band bringing retro-futuristic vibes to modern music. Their latest album "City Lights" is out now.',
        slug: 'neon-dreams',
        featured: false,
        instagram_url: 'https://instagram.com/neondreams',
        facebook_url: 'https://facebook.com/neondreams',
      },
      {
        name: 'Void Walker',
        bio: 'Experimental hip-hop artist pushing boundaries with unique production and thought-provoking lyrics.',
        slug: 'void-walker',
        featured: false,
        twitter_url: 'https://twitter.com/voidwalker',
        youtube_url: 'https://youtube.com/@voidwalker',
      },
      {
        name: 'Crystal Echo',
        bio: 'Indie rock band with a dreamy, ethereal sound. Their music has been featured in several indie films.',
        slug: 'crystal-echo',
        featured: true,
        instagram_url: 'https://instagram.com/crystalecho',
        facebook_url: 'https://facebook.com/crystalecho',
      },
    ];

    const artistIds = [];
    for (const artist of artists) {
      const result = await client.query(
        `INSERT INTO artists (name, slug, bio, featured, instagram_url, twitter_url, facebook_url, youtube_url, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [
          artist.name,
          artist.slug,
          artist.bio,
          artist.featured,
          artist.instagram_url || null,
          artist.twitter_url || null,
          artist.facebook_url || null,
          artist.youtube_url || null,
        ]
      );
      artistIds.push(result.rows[0].id);
      console.log(`  ✓ Created artist: ${artist.name}`);
    }

    // 2. Create Posts
    console.log('\n📰 Creating posts...');
    const posts = [
      {
        title: 'Electric Pulse Releases New Single "Neon Nights"',
        excerpt: 'The electronic producer drops his latest track featuring mesmerizing synths and powerful basslines.',
        content: 'Electric Pulse has just released his highly anticipated new single "Neon Nights". The track showcases his signature style of blending electronic elements with innovative production techniques. Available now on all major streaming platforms.',
        slug: 'electric-pulse-releases-neon-nights',
        status: 'published',
        featured: true,
        published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        title: 'Midnight Shadows Announces Tour Dates',
        excerpt: 'The dark ambient duo will be performing across North America this spring.',
        content: 'Midnight Shadows has announced their upcoming spring tour, featuring stops in major cities across North America. Tickets go on sale this Friday. The tour will support their latest album "Eternal Darkness".',
        slug: 'midnight-shadows-announces-tour',
        status: 'published',
        featured: false,
        published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        title: 'Neon Dreams Drops "City Lights" Album',
        excerpt: 'The synth-pop band releases their full-length album featuring 12 new tracks.',
        content: 'Neon Dreams has released their highly anticipated album "City Lights". The album features 12 tracks that blend retro synth-pop with modern production. The band describes it as their most ambitious project to date.',
        slug: 'neon-dreams-city-lights-album',
        status: 'published',
        featured: true,
        published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
      {
        title: 'Void Walker Collaborates with Crystal Echo',
        excerpt: 'Two artists team up for a unique cross-genre collaboration.',
        content: 'In an unexpected collaboration, Void Walker and Crystal Echo have joined forces to create a new track that blends experimental hip-hop with indie rock. The single is set to release next month.',
        slug: 'void-walker-crystal-echo-collaboration',
        status: 'published',
        featured: false,
        published_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      },
      {
        title: 'Claim Records Signs New Artist',
        excerpt: 'The label welcomes a fresh talent to its roster.',
        content: 'Claim Records is excited to announce the signing of a new artist. More details will be revealed in the coming weeks. Stay tuned for updates!',
        slug: 'claim-records-new-signing',
        status: 'draft',
        featured: false,
        published_at: null,
      },
    ];

    const postIds = [];
    for (const post of posts) {
      const result = await client.query(
        `INSERT INTO posts (title, slug, excerpt, content, author_id, status, featured, published_at, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
         ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title
         RETURNING id`,
        [
          post.title,
          post.slug,
          post.excerpt,
          post.content,
          authorId,
          post.status,
          post.featured,
          post.published_at,
        ]
      );
      postIds.push(result.rows[0].id);
      console.log(`  ✓ Created post: ${post.title}`);
    }

    // 3. Create Products
    console.log('\n🛍️  Creating products...');
    const products = [
      {
        name: 'Claim Records Logo T-Shirt',
        slug: 'claim-records-logo-tshirt',
        description: 'Classic black t-shirt featuring the Claim Records logo. Made from 100% cotton.',
        price: 25.00,
        category: 'shirt',
        product_type: 'physical',
        artist_id: null,
        featured: true,
        in_stock: true,
        inventory_count: 50,
      },
      {
        name: 'Electric Pulse - Neon Nights (Digital Download)',
        slug: 'electric-pulse-neon-nights-digital',
        description: 'Download the latest single from Electric Pulse in high-quality MP3 format.',
        price: 1.99,
        category: 'digital',
        product_type: 'digital',
        artist_id: artistIds[0],
        featured: true,
        in_stock: true,
        download_url: 'https://example.com/downloads/electric-pulse-neon-nights.mp3',
        download_limit: 5,
        expiry_days: 30,
      },
      {
        name: 'Midnight Shadows - Eternal Darkness Vinyl',
        slug: 'midnight-shadows-eternal-darkness-vinyl',
        description: 'Limited edition vinyl pressing of "Eternal Darkness" by Midnight Shadows.',
        price: 35.00,
        category: 'other',
        product_type: 'physical',
        artist_id: artistIds[1],
        featured: true,
        in_stock: true,
        inventory_count: 25,
      },
      {
        name: 'Neon Dreams - City Lights CD',
        slug: 'neon-dreams-city-lights-cd',
        description: 'Physical CD copy of "City Lights" by Neon Dreams. Includes digital download code.',
        price: 15.00,
        category: 'other',
        product_type: 'bundle',
        artist_id: artistIds[2],
        featured: false,
        in_stock: true,
        inventory_count: 100,
      },
      {
        name: 'Claim Records Sticker Pack',
        slug: 'claim-records-sticker-pack',
        description: 'Set of 5 vinyl stickers featuring Claim Records branding and artist logos.',
        price: 8.00,
        category: 'sticker',
        product_type: 'physical',
        artist_id: null,
        featured: false,
        in_stock: true,
        inventory_count: 200,
      },
      {
        name: 'Artist Logo Sticker Collection',
        slug: 'artist-logo-sticker-collection',
        description: 'Premium vinyl sticker collection featuring all your favorite Claim Records artists. Perfect for laptops, water bottles, and more.',
        price: 12.00,
        category: 'sticker',
        product_type: 'physical',
        artist_id: null,
        featured: true,
        in_stock: true,
        inventory_count: 150,
      },
      {
        name: 'Void Walker - Experimental Mixtape (Digital)',
        slug: 'void-walker-experimental-mixtape',
        description: 'Digital download of Void Walker\'s latest experimental mixtape. Includes bonus tracks.',
        price: 4.99,
        category: 'digital',
        product_type: 'digital',
        artist_id: artistIds[3],
        featured: false,
        in_stock: true,
        download_url: 'https://example.com/downloads/void-walker-mixtape.zip',
        download_limit: 3,
        expiry_days: 60,
      },
    ];

    const productIds = [];
    for (const product of products) {
      const result = await client.query(
        `INSERT INTO products (name, slug, description, price, category, product_type, artist_id, featured, in_stock, inventory_count, download_url, download_limit, expiry_days, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, CURRENT_TIMESTAMP)
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [
          product.name,
          product.slug,
          product.description,
          product.price,
          product.category,
          product.product_type,
          product.artist_id,
          product.featured,
          product.in_stock,
          product.inventory_count,
          product.download_url || null,
          product.download_limit || null,
          product.expiry_days || null,
        ]
      );
      productIds.push(result.rows[0].id);
      console.log(`  ✓ Created product: ${product.name}`);

      // Add size variants for t-shirt
      if (product.slug === 'claim-records-logo-tshirt') {
        const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
        for (const size of sizes) {
          await client.query(
            `INSERT INTO product_variants (product_id, variant_type, variant_value, inventory_count)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (product_id, variant_type, variant_value) DO NOTHING`,
            [result.rows[0].id, 'size', size, 10]
          );
        }
        console.log(`    ✓ Added size variants for t-shirt`);
      }
    }

    // 4. Create Videos
    console.log('\n🎥 Creating videos...');
    const videos = [
      {
        title: 'Electric Pulse - Neon Nights (Official Music Video)',
        slug: 'electric-pulse-neon-nights-music-video',
        description: 'Official music video for "Neon Nights" by Electric Pulse. Directed by acclaimed filmmaker.',
        video_type: 'youtube',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        artist_id: artistIds[0],
        category: 'Music Video',
        featured: true,
        view_count: 12500,
      },
      {
        title: 'Midnight Shadows - Live Performance at Red Rocks',
        slug: 'midnight-shadows-live-red-rocks',
        description: 'Full live performance from Midnight Shadows\' recent show at Red Rocks Amphitheatre.',
        video_type: 'youtube',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        artist_id: artistIds[1],
        category: 'Live Performance',
        featured: true,
        view_count: 8900,
      },
      {
        title: 'Neon Dreams - Behind the Scenes: City Lights Recording',
        slug: 'neon-dreams-behind-scenes',
        description: 'Go behind the scenes as Neon Dreams records their latest album "City Lights".',
        video_type: 'youtube',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        artist_id: artistIds[2],
        category: 'Behind the Scenes',
        featured: false,
        view_count: 3200,
      },
      {
        title: 'Void Walker - Studio Session',
        slug: 'void-walker-studio-session',
        description: 'Watch Void Walker create in the studio, experimenting with new sounds and techniques.',
        video_type: 'vimeo',
        video_url: 'https://vimeo.com/123456789',
        artist_id: artistIds[3],
        category: 'Studio Session',
        featured: false,
        view_count: 1800,
      },
    ];

    const videoIds = [];
    for (const video of videos) {
      const result = await client.query(
        `INSERT INTO videos (title, slug, description, video_type, video_url, artist_id, category, featured, view_count, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
         ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title
         RETURNING id`,
        [
          video.title,
          video.slug,
          video.description,
          video.video_type,
          video.video_url,
          video.artist_id,
          video.category,
          video.featured,
          video.view_count,
        ]
      );
      videoIds.push(result.rows[0].id);
      console.log(`  ✓ Created video: ${video.title}`);
    }

    // 5. Create Orders
    console.log('\n📦 Creating orders...');
    const orders = [
      {
        email: 'customer1@example.com',
        first_name: 'John',
        last_name: 'Doe',
        phone: '555-0101',
        shipping_city: 'Los Angeles',
        shipping_state: 'CA',
        shipping_postal_code: '90001',
        shipping_country: 'USA',
        subtotal: 25.00,
        shipping_cost: 5.00,
        tax: 2.50,
        total: 32.50,
        payment_method: 'stripe',
        payment_status: 'paid',
        order_status: 'shipped',
      },
      {
        email: 'customer2@example.com',
        first_name: 'Jane',
        last_name: 'Smith',
        shipping_city: 'New York',
        shipping_state: 'NY',
        shipping_postal_code: '10001',
        shipping_country: 'USA',
        subtotal: 1.99,
        shipping_cost: 0,
        tax: 0.20,
        total: 2.19,
        payment_method: 'paypal',
        payment_status: 'paid',
        order_status: 'delivered',
      },
      {
        email: 'customer3@example.com',
        first_name: 'Mike',
        last_name: 'Johnson',
        shipping_city: 'Chicago',
        shipping_state: 'IL',
        shipping_postal_code: '60601',
        shipping_country: 'USA',
        subtotal: 50.00,
        shipping_cost: 8.00,
        tax: 4.50,
        total: 62.50,
        payment_method: 'stripe',
        payment_status: 'paid',
        order_status: 'processing',
      },
    ];

    const orderIds = [];
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const orderNumber = generateOrderNumber();
      const result = await client.query(
        `INSERT INTO orders (order_number, email, first_name, last_name, phone, shipping_city, shipping_state, shipping_postal_code, shipping_country, subtotal, shipping_cost, tax, total, payment_method, payment_status, order_status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, CURRENT_TIMESTAMP - INTERVAL '${i} days')
         RETURNING id`,
        [
          orderNumber,
          order.email,
          order.first_name,
          order.last_name,
          order.phone || null,
          order.shipping_city,
          order.shipping_state,
          order.shipping_postal_code,
          order.shipping_country,
          order.subtotal,
          order.shipping_cost,
          order.tax,
          order.total,
          order.payment_method,
          order.payment_status,
          order.order_status,
        ]
      );
      orderIds.push(result.rows[0].id);
      console.log(`  ✓ Created order: ${orderNumber}`);

      // Add order items
      if (i === 0) {
        // First order: t-shirt
        await client.query(
          `INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, variant_info)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            result.rows[0].id,
            productIds[0],
            'Claim Records Logo T-Shirt',
            25.00,
            1,
            JSON.stringify({ size: 'L' }),
          ]
        );
      } else if (i === 1) {
        // Second order: digital download
        await client.query(
          `INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, variant_info)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            result.rows[0].id,
            productIds[1],
            'Electric Pulse - Neon Nights (Digital Download)',
            1.99,
            1,
            null,
          ]
        );
      } else if (i === 2) {
        // Third order: multiple items
        await client.query(
          `INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, variant_info)
           VALUES ($1, $2, $3, $4, $5, $6), ($7, $8, $9, $10, $11, $12)`,
          [
            result.rows[0].id,
            productIds[0],
            'Claim Records Logo T-Shirt',
            25.00,
            1,
            JSON.stringify({ size: 'M' }),
            result.rows[0].id,
            productIds[4],
            'Claim Records Sticker Pack',
            8.00,
            2,
            null,
          ]
        );
      }
    }

    await client.query('COMMIT');
    console.log('\n✅ Database seeding completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - ${artists.length} artists created`);
    console.log(`   - ${posts.length} posts created`);
    console.log(`   - ${products.length} products created`);
    console.log(`   - ${videos.length} videos created`);
    console.log(`   - ${orders.length} orders created`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedData()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seeding failed:', error);
    process.exit(1);
  });


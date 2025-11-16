import { query } from '@/lib/db';
import ProductCard from '@/components/shop/ProductCard';
import ArtistCard from '@/components/artists/ArtistCard';
import PostCard from '@/components/content/PostCard';

interface YouMightLikeProps {
  excludeIds?: string[];
  type?: 'products' | 'artists' | 'posts' | 'mixed';
  limit?: number;
  currentProductId?: string;
  currentArtistId?: string;
  currentPostId?: string;
}

export default async function YouMightLike({
  excludeIds = [],
  type = 'mixed',
  limit = 4,
  currentProductId,
  currentArtistId,
  currentPostId,
}: YouMightLikeProps) {
  const items: any[] = [];

  if (type === 'products' || type === 'mixed') {
    let productsQuery = `
      SELECT p.*, a.name as artist_name, a.slug as artist_slug
      FROM products p
      LEFT JOIN artists a ON p.artist_id = a.id
      WHERE p.in_stock = true
    `;
    const params: any[] = [];
    let paramCount = 0;

    if (currentProductId) {
      paramCount++;
      productsQuery += ` AND p.id != $${paramCount}`;
      params.push(currentProductId);
    }

    if (excludeIds.length > 0) {
      paramCount++;
      productsQuery += ` AND p.id != ALL($${paramCount})`;
      params.push(excludeIds);
    }

    productsQuery += ` ORDER BY RANDOM() LIMIT $${paramCount + 1}`;
    params.push(limit);

    const productsResult = await query(productsQuery, params);
    const products = productsResult.rows.map((product: any) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: parseFloat(product.price),
      images: [product.image || '/img/shop/default.jpg'],
      artistName: product.artist_name,
      type: 'product',
    }));
    items.push(...products);
  }

  if (type === 'artists' || type === 'mixed') {
    let artistsQuery = `
      SELECT * FROM artists WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 0;

    if (currentArtistId) {
      paramCount++;
      artistsQuery += ` AND id != $${paramCount}`;
      params.push(currentArtistId);
    }

    if (excludeIds.length > 0) {
      paramCount++;
      artistsQuery += ` AND id != ALL($${paramCount})`;
      params.push(excludeIds);
    }

    artistsQuery += ` ORDER BY RANDOM() LIMIT $${paramCount + 1}`;
    params.push(limit);

    const artistsResult = await query(artistsQuery, params);
    const artists = artistsResult.rows.map((artist: any) => ({
      id: artist.id,
      name: artist.name,
      slug: artist.slug,
      image: artist.image || artist.profile_image || '/img/artist/default.jpg',
      profileImage: artist.profile_image || artist.image || '/img/artist/default.jpg',
      type: 'artist',
    }));
    items.push(...artists);
  }

  if (type === 'posts' || type === 'mixed') {
    let postsQuery = `
      SELECT * FROM posts WHERE published = true
    `;
    const params: any[] = [];
    let paramCount = 0;

    if (currentPostId) {
      paramCount++;
      postsQuery += ` AND id != $${paramCount}`;
      params.push(currentPostId);
    }

    if (excludeIds.length > 0) {
      paramCount++;
      postsQuery += ` AND id != ALL($${paramCount})`;
      params.push(excludeIds);
    }

    postsQuery += ` ORDER BY RANDOM() LIMIT $${paramCount + 1}`;
    params.push(limit);

    const postsResult = await query(postsQuery, params);
    const posts = postsResult.rows.map((post: any) => ({
      ...post,
      type: 'post',
    }));
    items.push(...posts);
  }

  // Shuffle and limit
  const shuffled = items.sort(() => Math.random() - 0.5).slice(0, limit);

  if (shuffled.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-8">You Might Like These</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {shuffled.map((item: any) => {
            if (item.type === 'product') {
              return <ProductCard key={item.id} product={item} />;
            }
            if (item.type === 'artist') {
              return <ArtistCard key={item.id} artist={item} variant="card" />;
            }
            if (item.type === 'post') {
              return <PostCard key={item.id} post={item} />;
            }
            return null;
          })}
        </div>
      </div>
    </section>
  );
}


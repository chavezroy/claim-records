import Link from 'next/link';
import { query } from '@/lib/db';
import ArtistCard from '@/components/artists/ArtistCard';
import ProductCard from '@/components/shop/ProductCard';
import PostCard from '@/components/content/PostCard';

interface FeaturedMusicProps {
  limit?: number;
}

export default async function FeaturedMusic({ limit = 6 }: FeaturedMusicProps) {
  // Fetch featured artists
  const artistsResult = await query(
    `SELECT * FROM artists WHERE featured = true ORDER BY created_at DESC LIMIT $1`,
    [limit]
  );
  const artists = artistsResult.rows.map((artist: any) => ({
    id: artist.id,
    name: artist.name,
    slug: artist.slug,
    image: artist.image || artist.profile_image || '/img/artist/default.jpg',
    profileImage: artist.profile_image || artist.image || '/img/artist/default.jpg',
    bio: artist.bio,
  }));

  // Fetch featured products
  const productsResult = await query(
    `SELECT p.*, a.name as artist_name, a.slug as artist_slug
     FROM products p
     LEFT JOIN artists a ON p.artist_id = a.id
     WHERE p.featured = true AND p.in_stock = true
     ORDER BY p.created_at DESC
     LIMIT $1`,
    [limit]
  );
  const products = productsResult.rows.map((product: any) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description || '',
    price: parseFloat(product.price),
    images: [product.image || '/img/shop/default.jpg'],
    category: (product.category || 'other') as 'shirt' | 'sticker' | 'digital' | 'other',
    inStock: product.in_stock ?? true,
    artistName: product.artist_name,
  }));

  // Fetch featured posts
  const postsResult = await query(
    `SELECT * FROM posts WHERE featured = true AND published = true ORDER BY created_at DESC LIMIT $1`,
    [limit]
  );
  const posts = postsResult.rows;

  if (artists.length === 0 && products.length === 0 && posts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Music & Artists</h2>
        
        {artists.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Featured Artists</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {artists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} variant="card" />
              ))}
            </div>
          </div>
        )}

        {products.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Featured Products</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {posts.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Latest News</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


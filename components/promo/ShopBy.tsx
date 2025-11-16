import Link from 'next/link';
import Image from 'next/image';
import { query } from '@/lib/db';
import Card from '@/components/ui/Card';
import { getProductPlaceholder, getLoremFlickrUrl, isValidImageUrl } from '@/lib/utils/loremflickr';

interface ShopByProps {
  type: 'products' | 'artists' | 'featured';
  limit?: number;
}

export default async function ShopBy({ type, limit = 4 }: ShopByProps) {
  if (type === 'products') {
    const categoriesResult = await query(
      `SELECT DISTINCT category, COUNT(*) as count
       FROM products
       WHERE in_stock = true AND category IS NOT NULL
       GROUP BY category
       ORDER BY count DESC
       LIMIT $1`,
      [limit]
    );

    const categories = categoriesResult.rows;

    if (categories.length === 0) {
      return null;
    }

    // Get a sample product image for each category
    const categoriesWithImages = await Promise.all(
      categories.map(async (cat: any) => {
        const productResult = await query(
          `SELECT image FROM products WHERE category = $1 AND in_stock = true AND image IS NOT NULL LIMIT 1`,
          [cat.category]
        );
        const productImage = productResult.rows[0]?.image;
        return {
          ...cat,
          image: isValidImageUrl(productImage) ? productImage : getProductPlaceholder(400, 400, cat.category),
        };
      })
    );

    return (
      <section className="py-12">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categoriesWithImages.map((category: any) => (
              <Card key={category.category} href={`/shop?category=${category.category}`}>
                <div className="relative w-full aspect-square overflow-hidden bg-white">
                  <Image
                    src={category.image}
                    alt={category.category}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold capitalize">{category.category}</h3>
                  <p className="text-sm text-gray-600">{category.count} products</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (type === 'artists') {
    const artistsResult = await query(
      `SELECT a.*, COUNT(p.id) as product_count
       FROM artists a
       LEFT JOIN products p ON a.id = p.artist_id
       WHERE p.in_stock = true
       GROUP BY a.id
       HAVING COUNT(p.id) > 0
       ORDER BY a.name ASC
       LIMIT $1`,
      [limit]
    );

    const artists = artistsResult.rows.map((artist: any) => {
      const artistImage = artist.image || artist.profile_image;
      const placeholderImage = getLoremFlickrUrl(400, 400, 'music,artist,band', parseInt(artist.id.replace(/\D/g, '').slice(0, 8) || '0', 10));
      return {
        id: artist.id,
        name: artist.name,
        slug: artist.slug,
        image: isValidImageUrl(artistImage) ? artistImage : placeholderImage,
        profileImage: isValidImageUrl(artist.profile_image) ? artist.profile_image : placeholderImage,
        productCount: artist.product_count,
      };
    });

    if (artists.length === 0) {
      return null;
    }

    return (
      <section className="py-12 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Artist</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {artists.map((artist) => (
              <Link
                key={artist.id}
                href={`/shop?artist=${artist.id}`}
                className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative w-full aspect-square overflow-hidden">
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{artist.name}</h3>
                  <p className="text-sm text-gray-600">{artist.productCount} products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (type === 'featured') {
    const productsResult = await query(
      `SELECT p.*, a.name as artist_name, a.slug as artist_slug
       FROM products p
       LEFT JOIN artists a ON p.artist_id = a.id
       WHERE p.featured = true AND p.in_stock = true
       ORDER BY p.created_at DESC
       LIMIT $1`,
      [limit]
    );

    const products = productsResult.rows.map((product: any) => {
      const productImage = product.image;
      const imageSrc = isValidImageUrl(productImage) 
        ? productImage 
        : getProductPlaceholder(400, 400, product.category, product.id);
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: parseFloat(product.price),
        images: [imageSrc],
        artistName: product.artist_name,
      };
    });

    if (products.length === 0) {
      return null;
    }

    return (
      <section className="py-12">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.slug}`}
                className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative w-full aspect-square overflow-hidden bg-white">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                  {product.artistName && (
                    <p className="text-sm text-gray-600">{product.artistName}</p>
                  )}
                  <p className="text-lg font-bold mt-2">${product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return null;
}


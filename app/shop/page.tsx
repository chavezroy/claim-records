import Image from 'next/image';
import { query } from '@/lib/db';
import ProductGrid from '@/components/shop/ProductGrid';
import ArtistCard from '@/components/artists/ArtistCard';
import Card from '@/components/ui/Card';

export const dynamic = 'force-dynamic';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; artist?: string };
}) {
  // Fetch products from database
  let productsQuery = `
    SELECT p.*, a.name as artist_name, a.slug as artist_slug
    FROM products p
    LEFT JOIN artists a ON p.artist_id = a.id
    WHERE p.in_stock = true
  `;
  const params: any[] = [];
  let paramCount = 0;

  if (searchParams.category) {
    paramCount++;
    productsQuery += ` AND p.category = $${paramCount}`;
    params.push(searchParams.category);
  }

  if (searchParams.artist) {
    paramCount++;
    productsQuery += ` AND p.artist_id = $${paramCount}`;
    params.push(searchParams.artist);
  }

  productsQuery += ` ORDER BY p.featured DESC, p.created_at DESC`;

  const productsResult = await query(productsQuery, params);
  const allProducts = productsResult.rows;

  // Fetch featured products
  const featuredResult = await query(
    `SELECT p.*, a.name as artist_name, a.slug as artist_slug
     FROM products p
     LEFT JOIN artists a ON p.artist_id = a.id
     WHERE p.featured = true AND p.in_stock = true
     ORDER BY p.created_at DESC
     LIMIT 8`
  );
  const featuredProducts = featuredResult.rows;

  // Fetch artists for shop by artist section
  const artistsResult = await query(
    `SELECT a.*, COUNT(p.id) as product_count
     FROM artists a
     LEFT JOIN products p ON a.id = p.artist_id
     WHERE p.in_stock = true
     GROUP BY a.id
     HAVING COUNT(p.id) > 0
     ORDER BY a.name ASC
     LIMIT 4`
  );
  const shopByArtist = artistsResult.rows.map((artist: any) => ({
    id: artist.id,
    name: artist.name,
    slug: artist.slug,
    image: artist.image || artist.profile_image || '/img/artist/default.jpg',
    profileImage: artist.profile_image || artist.image || '/img/artist/default.jpg',
  }));

  return (
    <>
      {/* Banner */}
      <section>
        <div className="carousel carousel-dark slide bg-black">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <Image
                src="/img/shop_banner.jpg"
                alt="Shop Claim Records"
                width={1920}
                height={600}
                className="d-block w-100"
              />
              <div className="carousel-caption d-none d-md-block">
                <h5>Shop Claim Records</h5>
                <p>Get Claim Records merch from your favorite artists.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section>
          <div className="container" style={{ paddingTop: '3rem', paddingBottom: '1.5rem' }}>
            <h1 className="text-center" style={{ marginBottom: '3rem', paddingTop: '1rem' }}>Featured products</h1>
            <ProductGrid products={featuredProducts.map(formatProduct)} />
          </div>
        </section>
      )}

      {/* All Products */}
      {allProducts.length > 0 && (
        <section>
          <div className="container" style={{ paddingTop: '3rem', paddingBottom: '1.5rem' }}>
            <h2 className="text-center" style={{ marginBottom: '3rem', paddingTop: '1rem' }}>All Products</h2>
            <ProductGrid products={allProducts.map(formatProduct)} />
          </div>
        </section>
      )}

      {allProducts.length === 0 && (
      <section>
          <div className="container" style={{ paddingTop: '3rem', paddingBottom: '1.5rem' }}>
            <div className="text-center" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
              <p className="text-gray-500 text-lg">No products available at this time.</p>
            </div>
        </div>
      </section>
      )}

      {/* Shop by Products */}
      <section>
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '1.5rem' }}>
          <h2 className="text-center" style={{ marginBottom: '3rem', paddingTop: '1rem' }}>Shop by products</h2>
          <div className="row mb-5 products">
            <div className="col-sm-3 mb-3 mb-sm-0">
              <Card href="/shop?category=shirt">
                <div className="thumb relative w-full overflow-hidden bg-white" style={{ height: '200px' }}>
                  <Image
                    src="/img/shop/FG-LG-black.jpg"
                    alt="Shirts"
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover"
                    style={{ 
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      left: 0,
                      top: 0,
                      transform: 'none'
                    }}
                  />
                </div>
                <div className="card-body p-5 min-h-[110px]" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                  <p className="card-title mb-0 text-primary hover:text-black transition-colors" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Shirts</p>
                  <p className="card-subtitle mb-2 text-gray-500 text-sm" style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.4', maxHeight: '2.8em' }}>Last Goodbye T-shirt</p>
                </div>
              </Card>
            </div>
            <div className="col-sm-3 mb-3 mb-sm-0">
              <Card href="/shop?category=sticker">
                <div className="thumb relative w-full overflow-hidden bg-white" style={{ height: '200px' }}>
                  <Image
                    src="/img/shop/thepriceisriot.jpg"
                    alt="Stickers"
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover"
                    style={{ 
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      left: 0,
                      top: 0,
                      transform: 'none'
                    }}
                  />
                </div>
                <div className="card-body p-5 min-h-[110px]" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                  <p className="card-title mb-0 text-primary hover:text-black transition-colors" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Stickers</p>
                  <p className="card-subtitle mb-2 text-gray-500 text-sm" style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.4', maxHeight: '2.8em' }}>Logo T-shirt</p>
                </div>
              </Card>
            </div>
            <div className="col-sm-3 mb-3 mb-sm-0">
              <Card href="/shop?category=digital">
                <div className="thumb relative w-full overflow-hidden bg-white" style={{ height: '200px' }}>
                  <Image
                    src="/img/shop/featured_logic.png"
                    alt="Digital Content"
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover"
                    style={{ 
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      left: 0,
                      top: 0,
                      transform: 'none'
                    }}
                  />
                </div>
                <div className="card-body p-5 min-h-[110px]" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                  <p className="card-title mb-0 text-primary hover:text-black transition-colors" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Digital Content</p>
                  <p className="card-subtitle mb-2 text-gray-500 text-sm" style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.4', maxHeight: '2.8em' }}>Mix and master templates for Logic Pro</p>
                </div>
              </Card>
            </div>
            <div className="col-sm-3 mb-3 mb-sm-0">
              <Card href="/shop?category=accessories">
                <div className="thumb relative w-full overflow-hidden bg-white" style={{ height: '200px' }}>
                  <Image
                    src="/img/shop/belt-vcut-1.jpg"
                    alt="Accessories"
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover"
                    style={{ 
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      left: 0,
                      top: 0,
                      transform: 'none'
                    }}
                  />
                </div>
                <div className="card-body p-5 min-h-[110px]" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                  <p className="card-title mb-0 text-primary hover:text-black transition-colors" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Accessories</p>
                  <p className="card-subtitle mb-2 text-gray-500 text-sm" style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.4', maxHeight: '2.8em' }}>Merchandise and accessories</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Artist */}
      {shopByArtist.length > 0 && (
      <section>
          <div className="container" style={{ paddingTop: '3rem', paddingBottom: '1.5rem' }}>
            <h2 className="text-center" style={{ marginBottom: '3rem', paddingTop: '1rem' }}>Shop by artist</h2>
          <div className="row mb-5">
              {shopByArtist.map((artist) => (
              <div key={artist.id} className="col-sm-3 mb-3 mb-sm-0">
                <ArtistCard artist={artist} variant="card" />
              </div>
            ))}
          </div>
        </div>
      </section>
      )}
    </>
  );
}

// Helper function to format product for ProductGrid
function formatProduct(product: any) {
  // Fetch product images - keep original image path, ProductCard will handle fallback
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: parseFloat(product.price),
    images: product.image ? [product.image] : [], // Empty array will trigger placeholder in ProductCard
    category: product.category,
    artistId: product.artist_id,
    artistName: product.artist_name,
    artistSlug: product.artist_slug,
    variants: {
      size: product.variants?.size || [],
      color: product.variants?.color || [],
    },
    inStock: product.in_stock,
    productType: product.product_type,
  };
}


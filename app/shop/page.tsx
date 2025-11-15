import Image from 'next/image';
import { getFeaturedProducts } from '@/lib/data/products';
import { artists } from '@/lib/data/artists';
import ProductGrid from '@/components/shop/ProductGrid';
import ProductCard from '@/components/shop/ProductCard';
import ArtistCard from '@/components/artists/ArtistCard';
import Card from '@/components/ui/Card';

export default function ShopPage() {
  const featuredProducts = getFeaturedProducts();
  const shopByArtist = artists.slice(0, 3);

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
      <section>
        <div className="container pt-5">
          <h1 className="text-center">Featured products</h1>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      {/* Shop by Products */}
      <section>
        <div className="container pt-5">
          <h2 className="text-center">Shop by products</h2>
          <div className="row mb-5 products">
            <div className="col-sm-4 mb-3 mb-sm-0">
              <Card href="/shop?category=shirt">
                <div className="thumb relative w-full overflow-hidden bg-white" style={{ height: '340px' }}>
                  <Image
                    src="/img/shop/FG-LG-black.jpg"
                    alt="Shirts"
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 33vw"
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
                <div className="card-body p-5 min-h-44">
                  <p className="card-title mb-0 text-primary hover:text-black transition-colors">Shirts</p>
                  <p className="card-subtitle mb-2 text-gray-500 text-sm">Last Goodbye T-shirt</p>
                </div>
              </Card>
            </div>
            <div className="col-sm-4 mb-3 mb-sm-0">
              <Card href="/shop?category=sticker">
                <div className="thumb relative w-full overflow-hidden bg-white" style={{ height: '340px' }}>
                  <Image
                    src="/img/shop/thepriceisriot.jpg"
                    alt="Stickers"
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 33vw"
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
                <div className="card-body p-5 min-h-44">
                  <p className="card-title mb-0 text-primary hover:text-black transition-colors">Stickers</p>
                  <p className="card-subtitle mb-2 text-gray-500 text-sm">Logo T-shirt</p>
                </div>
              </Card>
            </div>
            <div className="col-sm-4 mb-3 mb-sm-0">
              <Card href="/shop?category=digital">
                <div className="thumb relative w-full overflow-hidden bg-white" style={{ height: '340px' }}>
                  <Image
                    src="/img/shop/featured_logic.png"
                    alt="Digital Content"
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 33vw"
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
                <div className="card-body p-5 min-h-44">
                  <p className="card-title mb-0 text-primary hover:text-black transition-colors">Digital Content</p>
                  <p className="card-subtitle mb-2 text-gray-500 text-sm">Mix and master templates for Logic Pro</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Artist */}
      <section>
        <div className="container pt-5">
          <h2 className="text-center">Shop by artist</h2>
          <div className="row mb-5">
            {shopByArtist.map((artist) => (
              <div key={artist.id} className="col-sm-4 mb-3 mb-sm-0">
                <ArtistCard artist={artist} variant="card" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}


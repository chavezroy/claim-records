import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getFeaturedProducts } from '@/lib/data/products';
import ProductGrid from '@/components/shop/ProductGrid';
import Card from '@/components/ui/Card';

type PageProps = {
  params: {
    slug: string;
  };
};

export default function ShopDetailPage({ params }: PageProps) {
  const product = getProductBySlug(params.slug);
  
  if (!product) {
    notFound();
  }

  const relatedProducts = getFeaturedProducts().filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <>
      {/* Product Detail */}
      <section>
        <div className="main-product-wrap product-wrap">
          <div className="container">
            <div className="row">
              <div className="product-images col-sm-5">
                <div className="product-main-image animate-fade-in">
                  <Image
                    alt={product.name}
                    src={product.images[0]}
                    width={600}
                    height={800}
                    className="w-full"
                    unoptimized
                  />
                </div>
              </div>
              <div className="product-details-wrapper col-sm-7">
                <div className="product-details" style={{ paddingLeft: '2rem' }}>
                  <h1 className="product-title mb-4">{product.name}</h1>
                  <p className="product-price mb-5" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#23201f' }}>
                    ${product.price.toFixed(2)}
                  </p>
                  <form action="/cart/add" method="post" className="mb-5">
                    <div className="product-options">
                      {product.variants?.size && (
                        <div className="mb-4">
                          <div className="d-flex align-items-center mb-2">
                            <label htmlFor="size" className="mb-0 me-3" style={{ minWidth: '80px', fontWeight: '500', fontSize: '0.95rem' }}>
                              Size
                            </label>
                            <select
                              id="size"
                              className="form-control form-select"
                              style={{ width: 'auto', minWidth: '120px', maxWidth: '200px' }}
                            >
                              {product.variants.size.map((size) => (
                                <option key={size} value={size}>
                                  {size}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                      <div className="mb-4">
                        <div className="d-flex align-items-center mb-2">
                          <label htmlFor="quantity" className="mb-0 me-3" style={{ minWidth: '80px', fontWeight: '500', fontSize: '0.95rem' }}>
                            Quantity
                          </label>
                          <input
                            id="quantity"
                            className="form-control"
                            type="number"
                            name="quantity"
                            defaultValue="1"
                            min="1"
                            style={{ width: 'auto', minWidth: '80px', maxWidth: '120px' }}
                          />
                        </div>
                      </div>
                      <div className="mb-5">
                        <div className="d-flex align-items-center">
                          <span className="mb-0 me-3" style={{ minWidth: '80px', fontWeight: '500', fontSize: '0.95rem' }}>
                            Share
                          </span>
                          <div className="d-flex gap-3">
                            <a target="_blank" href="#" className="text-xl hover:text-primary transition-colors" aria-label="Instagram">
                              <i className="bi bi-instagram"></i>
                            </a>
                            <a target="_blank" href="#" className="text-xl hover:text-primary transition-colors" aria-label="Twitter">
                              <i className="bi bi-twitter-x"></i>
                            </a>
                            <a target="_blank" href="#" className="text-xl hover:text-primary transition-colors" aria-label="Facebook">
                              <i className="bi bi-facebook"></i>
                            </a>
                            <a target="_blank" href="mailto:#" className="text-xl hover:text-primary transition-colors" aria-label="Email">
                              <i className="bi bi-envelope"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="add-to-cart">
                        <button
                          type="button"
                          className="btn btn-primary bg-primary text-white px-8 py-3 rounded hover:bg-primary/90"
                          style={{ fontSize: '1rem', fontWeight: '500', minWidth: '180px' }}
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </form>
                  <div className="product-description rte pt-4" style={{ borderTop: '1px solid #e5e7eb' }}>
                    <p className="fs-6 text-sm mb-2 text-gray-700">{product.description}</p>
                    {product.artistName && (
                      <p className="fs-6 text-sm mb-0 text-gray-700">
                        Artist: <Link href={`/artists/${product.artistId}`} className="text-primary hover:underline">{product.artistName}</Link>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <div className="container pt-5">
            <h2 className="text-center mb-5">You might like these</h2>
            <ProductGrid products={relatedProducts} columns={4} />
          </div>
        </section>
      )}
    </>
  );
}


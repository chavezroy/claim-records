'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { getProductBySlug, getFeaturedProducts } from '@/lib/data/products';
import ProductGrid from '@/components/shop/ProductGrid';
import { useCart } from '@/contexts/CartContext';

export default function ShopDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const product = getProductBySlug(slug);
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  
  if (!product) {
    return <div>Product not found</div>;
  }

  const relatedProducts = getFeaturedProducts().filter((p) => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (product.variants?.size && !selectedSize) {
      // Set default to first size if none selected
      setSelectedSize(product.variants.size[0]);
    }
    
    addToCart({
      productId: product.id,
      name: product.name,
      artistName: product.artistName,
      price: product.price,
      image: product.images[0],
      size: selectedSize || product.variants?.size?.[0],
      quantity: quantity,
    });
  };

  return (
    <>
      {/* Product Detail */}
      <section>
        <div className="main-product-wrap product-wrap">
          <div className="container">
            {/* Breadcrumbs */}
            <nav aria-label="breadcrumb" className="mb-2" style={{ marginTop: '0.5rem' }}>
              <ol className="breadcrumb d-flex align-items-center gap-2" style={{ margin: 0, padding: 0, listStyle: 'none', flexWrap: 'wrap' }}>
                <li className="breadcrumb-item">
                  <Link href="/" className="text-gray-600 hover:text-primary text-decoration-none">
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item" style={{ color: '#6c757d' }}>/</li>
                <li className="breadcrumb-item">
                  <Link href="/shop" className="text-gray-600 hover:text-primary text-decoration-none">
                    Shop
                  </Link>
                </li>
                <li className="breadcrumb-item" style={{ color: '#6c757d' }}>/</li>
                <li className="breadcrumb-item active" aria-current="page" style={{ color: '#212529' }}>
                  {product.name}
                </li>
              </ol>
            </nav>
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
                  <form onSubmit={(e) => { e.preventDefault(); handleAddToCart(); }} className="mb-5">
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
                              value={selectedSize || product.variants.size[0]}
                              onChange={(e) => setSelectedSize(e.target.value)}
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
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
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
                          type="submit"
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


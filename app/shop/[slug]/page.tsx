import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import ProductGrid from '@/components/shop/ProductGrid';
import AddToCartButton from '@/components/shop/AddToCartButton';
import YouMightLike from '@/components/promo/YouMightLike';

export default async function ShopDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // Fetch product from database
  const productResult = await query(
    `SELECT p.*, a.name as artist_name, a.slug as artist_slug
     FROM products p
     LEFT JOIN artists a ON p.artist_id = a.id
     WHERE p.slug = $1`,
    [params.slug]
  );

  if (productResult.rows.length === 0) {
    notFound();
  }

  const product = productResult.rows[0];

  // Fetch product images
  const imagesResult = await query(
    `SELECT m.file_path, m.file_url
     FROM product_images pi
     JOIN media m ON pi.media_id = m.id
     WHERE pi.product_id = $1
     ORDER BY pi.display_order ASC`,
    [product.id]
  );

  const productImages = imagesResult.rows.map((img: any) => img.file_url || img.file_path);
  const mainImage = productImages[0] || '/img/shop/default.jpg';

  // Fetch product variants
  const variantsResult = await query(
    'SELECT * FROM product_variants WHERE product_id = $1',
    [product.id]
  );

  const variants: any = {};
  variantsResult.rows.forEach((variant: any) => {
    if (!variants[variant.variant_type]) {
      variants[variant.variant_type] = [];
    }
    variants[variant.variant_type].push(variant.variant_value);
  });

  // Fetch related products
  const relatedResult = await query(
    `SELECT p.*, a.name as artist_name, a.slug as artist_slug
     FROM products p
     LEFT JOIN artists a ON p.artist_id = a.id
     WHERE p.id != $1 AND p.in_stock = true
     ORDER BY RANDOM()
     LIMIT 4`,
    [product.id]
  );

  const relatedProducts = relatedResult.rows.map(formatProduct);

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
                    src={mainImage}
                    width={600}
                    height={800}
                    className="w-full"
                    unoptimized
                  />
                </div>
                {productImages.length > 1 && (
                  <div className="product-thumbnails mt-4 d-flex gap-2">
                    {productImages.slice(1, 5).map((img: string, idx: number) => (
                      <div key={idx} className="thumbnail" style={{ width: '80px', height: '80px' }}>
                        <Image
                          src={img}
                          alt={`${product.name} ${idx + 2}`}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover rounded"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="product-details-wrapper col-sm-7">
                <div className="product-details" style={{ paddingLeft: '2rem', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                  <h1 className="product-title" style={{ marginBottom: '1rem', paddingTop: '1rem' }}>{product.name}</h1>
                  <p className="product-price" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#23201f', marginBottom: '3rem' }}>
                    ${parseFloat(product.price).toFixed(2)}
                  </p>
                  {product.product_type === 'digital' && (
                    <div className="mb-4 p-3 bg-blue-50 rounded">
                      <p className="text-blue-800 mb-0">
                        <i className="bi bi-download me-2"></i>
                        Digital Download - Available immediately after purchase
                      </p>
                    </div>
                  )}
                  <AddToCartButton
                    product={{
                      id: product.id,
                      name: product.name,
                      slug: product.slug,
                      price: parseFloat(product.price),
                      image: mainImage,
                      artistName: product.artist_name,
                      artistId: product.artist_id,
                      variants: Object.keys(variants).length > 0 ? variants : undefined,
                      productType: product.product_type,
                    }}
                  />
                  <div className="product-description rte" style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                    {product.description && (
                      <div
                        className="fs-6 text-sm mb-2 text-gray-700"
                        style={{ wordWrap: 'break-word', overflowWrap: 'break-word', overflow: 'hidden' }}
                        dangerouslySetInnerHTML={{ __html: product.description }}
                      />
                    )}
                    {product.artist_name && (
                      <p className="fs-6 text-sm mb-0 text-gray-700">
                        Artist:{' '}
                        <Link href={`/artists/${product.artist_slug}`} className="text-primary hover:underline">
                          {product.artist_name}
                        </Link>
                      </p>
                    )}
                    <p className="fs-6 text-sm mb-0 text-gray-700">
                      Category: <span className="capitalize">{product.category}</span>
                    </p>
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
          <div className="container" style={{ paddingTop: '3rem', paddingBottom: '1.5rem' }}>
            <h2 className="text-center" style={{ marginBottom: '3rem', paddingTop: '1rem' }}>You might like these</h2>
            <ProductGrid products={relatedProducts} columns={4} />
          </div>
        </section>
      )}

      {/* Promo Cards */}
      <YouMightLike
        type="products"
        limit={4}
        currentProductId={product.id}
        excludeIds={relatedProducts.map((p) => p.id)}
      />
    </>
  );
}

function formatProduct(product: any) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: parseFloat(product.price),
    images: ['/img/shop/default.jpg'], // Will need to fetch from product_images
    category: product.category,
    artistId: product.artist_id,
    artistName: product.artist_name,
    inStock: product.in_stock,
    productType: product.product_type,
  };
}

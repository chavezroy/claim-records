import Link from 'next/link';
import Image from 'next/image';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/session';

export default async function AdminProductsPage() {
  await requireAdmin();

  const result = await query(
    `SELECT p.*, a.name as artist_name, 
            (SELECT m.file_path 
             FROM product_images pi 
             JOIN media m ON pi.media_id = m.id 
             WHERE pi.product_id = p.id 
             ORDER BY pi.display_order ASC 
             LIMIT 1) as thumbnail_url
     FROM products p
     LEFT JOIN artists a ON p.artist_id = a.id
     ORDER BY p.created_at DESC`
  );

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center justify-center"
          title="New Product"
        >
          <i className="bi bi-plus-lg text-lg"></i>
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {result.rows.map((product: any) => (
            <li key={product.id}>
              <Link href={`/admin/products/${product.id}`} className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8 flex-1 min-w-0">
                      {product.thumbnail_url && (
                        <div className="flex-shrink-0" style={{ paddingRight: '0.5rem', paddingBottom: '0.5rem' }}>
                          <div className="h-16 w-16 relative rounded-md overflow-hidden bg-gray-100">
                            <Image
                              src={product.thumbnail_url}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {product.name}
                        </p>
                        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                          {product.description || 'No description'}
                        </p>
                      </div>
                    </div>
                    <div className="ml-5 flex-shrink-0">
                      <p className="text-sm font-medium text-gray-900">
                        ${parseFloat(product.price).toFixed(2)}
                      </p>
                      <span
                        className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.in_stock
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {product.category} • {product.product_type}
                        {product.artist_name && ` • ${product.artist_name}`}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      {new Date(product.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


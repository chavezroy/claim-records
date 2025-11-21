'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Artist {
  id: string;
  name: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [artists, setArtists] = useState<Artist[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    category: 'other' as 'shirt' | 'sticker' | 'digital' | 'other',
    product_type: 'physical' as 'physical' | 'digital' | 'bundle',
    artist_id: '',
    featured: false,
    in_stock: true,
    inventory_count: '',
    download_url: '',
    download_limit: '',
    expiry_days: '',
  });

  // Fetch artists on mount
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await fetch('/api/artists');
        if (response.ok) {
          const data = await response.json();
          setArtists(data.artists || []);
        }
      } catch (err) {
        console.error('Error fetching artists:', err);
      }
    };
    fetchArtists();
  }, []);

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug || name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description.trim() || null,
        price: parseFloat(formData.price),
        category: formData.category,
        product_type: formData.product_type,
        artist_id: formData.artist_id || null,
        featured: formData.featured,
        in_stock: formData.in_stock,
        inventory_count: formData.inventory_count ? parseInt(formData.inventory_count) : null,
        download_url: formData.download_url.trim() || null,
        download_limit: formData.download_limit ? parseInt(formData.download_limit) : null,
        expiry_days: formData.expiry_days ? parseInt(formData.expiry_days) : null,
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create product');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold text-gray-900" style={{ marginBottom: 0 }}>New Product</h1>
        <Link
          href="/admin/products"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Cancel
        </Link>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6 space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={handleNameChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900"
              style={{ boxSizing: 'border-box' }}
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900"
              style={{ boxSizing: 'border-box' }}
            />
            <p className="mt-1 text-xs text-gray-500">URL-friendly version of the name</p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900 resize-y"
              style={{ boxSizing: 'border-box' }}
            />
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price *
              </label>
              <input
                type="number"
                id="price"
                required
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900"
                style={{ boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                id="category"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900"
                style={{ boxSizing: 'border-box', backgroundImage: 'none' }}
              >
                <option value="shirt">Shirt</option>
                <option value="sticker">Sticker</option>
                <option value="digital">Digital</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Product Type and Artist */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="product_type" className="block text-sm font-medium text-gray-700">
                Product Type *
              </label>
              <select
                id="product_type"
                required
                value={formData.product_type}
                onChange={(e) => setFormData({ ...formData, product_type: e.target.value as any })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900"
                style={{ boxSizing: 'border-box', backgroundImage: 'none' }}
              >
                <option value="physical">Physical</option>
                <option value="digital">Digital</option>
                <option value="bundle">Bundle</option>
              </select>
            </div>

            <div>
              <label htmlFor="artist_id" className="block text-sm font-medium text-gray-700">
                Artist
              </label>
              <select
                id="artist_id"
                value={formData.artist_id}
                onChange={(e) => setFormData({ ...formData, artist_id: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900"
                style={{ boxSizing: 'border-box', backgroundImage: 'none' }}
              >
                <option value="">None</option>
                {artists.map((artist) => (
                  <option key={artist.id} value={artist.id}>
                    {artist.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Featured and In Stock */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                Featured Product
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="in_stock"
                checked={formData.in_stock}
                onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="in_stock" className="ml-2 block text-sm text-gray-700">
                In Stock
              </label>
            </div>
          </div>

          {/* Inventory Count */}
          {formData.product_type === 'physical' && (
            <div>
              <label htmlFor="inventory_count" className="block text-sm font-medium text-gray-700">
                Inventory Count
              </label>
              <input
                type="number"
                id="inventory_count"
                min="0"
                value={formData.inventory_count}
                onChange={(e) => setFormData({ ...formData, inventory_count: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900"
                style={{ boxSizing: 'border-box' }}
              />
            </div>
          )}

          {/* Digital Product Fields */}
          {formData.product_type === 'digital' && (
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Digital Product Settings</h3>
              
              <div>
                <label htmlFor="download_url" className="block text-sm font-medium text-gray-700">
                  Download URL
                </label>
                <input
                  type="url"
                  id="download_url"
                  value={formData.download_url}
                  onChange={(e) => setFormData({ ...formData, download_url: e.target.value })}
                  placeholder="https://example.com/download/file.zip"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900"
                  style={{ boxSizing: 'border-box' }}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="download_limit" className="block text-sm font-medium text-gray-700">
                    Download Limit
                  </label>
                  <input
                    type="number"
                    id="download_limit"
                    min="0"
                    value={formData.download_limit}
                    onChange={(e) => setFormData({ ...formData, download_limit: e.target.value })}
                    placeholder="Unlimited if empty"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900"
                    style={{ boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label htmlFor="expiry_days" className="block text-sm font-medium text-gray-700">
                    Expiry Days
                  </label>
                  <input
                    type="number"
                    id="expiry_days"
                    min="0"
                    value={formData.expiry_days}
                    onChange={(e) => setFormData({ ...formData, expiry_days: e.target.value })}
                    placeholder="Days until download expires"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900"
                    style={{ boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}


import Link from 'next/link';
import Image from 'next/image';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/session';

export default async function AdminArtistsPage() {
  await requireAdmin();

  const result = await query('SELECT * FROM artists ORDER BY name ASC');

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Artists</h1>
        <Link
          href="/admin/artists/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center justify-center"
          title="New Artist"
        >
          <i className="bi bi-plus-lg text-lg"></i>
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {result.rows.map((artist: any) => (
            <li key={artist.id}>
              <Link href={`/admin/artists/${artist.id}`} className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8 flex-1 min-w-0">
                      {(artist.profile_image || artist.image) && (
                        <div className="flex-shrink-0" style={{ paddingRight: '0.5rem', paddingBottom: '0.5rem' }}>
                          <div className="h-16 w-16 relative rounded-md overflow-hidden bg-gray-100">
                            <Image
                              src={artist.profile_image || artist.image}
                              alt={artist.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {artist.name}
                      </p>
                        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                        {artist.bio || 'No bio'}
                      </p>
                      </div>
                    </div>
                    <div className="ml-5 flex-shrink-0">
                      {artist.featured && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Slug: {artist.slug}
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


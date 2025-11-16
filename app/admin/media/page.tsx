import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/session';

export default async function AdminMediaPage() {
  await requireAdmin();

  const result = await query(
    'SELECT * FROM media ORDER BY created_at DESC LIMIT 50'
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
          disabled
        >
          Upload Media (Coming Soon)
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {result.rows.map((media: any) => (
            <li key={media.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {media.original_filename}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {media.file_type} • {media.mime_type || 'Unknown type'}
                    {media.file_size && ` • ${(media.file_size / 1024).toFixed(2)} KB`}
                  </p>
                </div>
                <div className="ml-5 flex-shrink-0 text-sm text-gray-500">
                  {new Date(media.created_at).toLocaleDateString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


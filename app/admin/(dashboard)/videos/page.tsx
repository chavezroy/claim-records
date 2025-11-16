import Link from 'next/link';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/session';

export default async function AdminVideosPage() {
  await requireAdmin();

  const result = await query(
    `SELECT v.*, a.name as artist_name
     FROM videos v
     LEFT JOIN artists a ON v.artist_id = a.id
     ORDER BY v.created_at DESC`
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Videos</h1>
        <Link
          href="/admin/videos/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
        >
          New Video
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {result.rows.map((video: any) => (
            <li key={video.id}>
              <Link href={`/admin/videos/${video.id}`} className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {video.title}
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        {video.description || 'No description'}
                      </p>
                    </div>
                    <div className="ml-5 flex-shrink-0">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {video.video_type}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {video.category || 'Uncategorized'}
                        {video.artist_name && ` • ${video.artist_name}`}
                        {video.view_count > 0 && ` • ${video.view_count} views`}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      {new Date(video.created_at).toLocaleDateString()}
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


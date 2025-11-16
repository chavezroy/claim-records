import Link from 'next/link';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/session';

export default async function AdminPostsPage() {
  await requireAdmin();

  const result = await query(
    `SELECT p.*, u.name as author_name
     FROM posts p
     LEFT JOIN users u ON p.author_id = u.id
     ORDER BY p.created_at DESC`
  );

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center justify-center"
          title="New Post"
        >
          <i className="bi bi-plus-lg text-lg"></i>
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {result.rows.map((post: any) => (
            <li key={post.id}>
              <Link href={`/admin/posts/${post.id}`} className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {post.title}
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        {post.excerpt || 'No excerpt'}
                      </p>
                    </div>
                    <div className="ml-5 flex-shrink-0">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          post.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : post.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {post.author_name || 'No author'}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      {new Date(post.created_at).toLocaleDateString()}
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


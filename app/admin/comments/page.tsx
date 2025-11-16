import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/session';

export default async function AdminCommentsPage() {
  await requireAdmin();

  const result = await query(
    `SELECT c.*, u.name as user_name, u.email as user_email
     FROM comments c
     LEFT JOIN users u ON c.user_id = u.id
     ORDER BY c.created_at DESC`
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Comments</h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {result.rows.map((comment: any) => (
            <li key={comment.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-900">
                      {comment.user_name || comment.author_name || 'Anonymous'}
                    </p>
                    <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      {comment.entity_type}
                    </span>
                    <span
                      className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        comment.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : comment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {comment.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-700">{comment.content}</p>
                </div>
                <div className="ml-5 flex-shrink-0 text-sm text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


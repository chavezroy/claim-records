import Link from 'next/link';
import { query } from '@/lib/db';
import Image from 'next/image';

export default async function NewsPage() {
  const result = await query(
    `SELECT p.*, u.name as author_name
     FROM posts p
     LEFT JOIN users u ON p.author_id = u.id
     WHERE p.status = 'published'
     ORDER BY p.published_at DESC NULLS LAST, p.created_at DESC`
  );

  const posts = result.rows;

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">News & Updates</h1>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: any) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {post.featured_image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h2>
                {post.excerpt && (
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{post.author_name || 'Claim Records'}</span>
                  <span>
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString()
                      : new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}


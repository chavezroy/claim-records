import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';

export default async function PostPage({ params }: { params: { slug: string } }) {
  const result = await query(
    `SELECT p.*, u.name as author_name, u.email as author_email
     FROM posts p
     LEFT JOIN users u ON p.author_id = u.id
     WHERE p.slug = $1 AND p.status = 'published'`,
    [params.slug]
  );

  if (result.rows.length === 0) {
    notFound();
  }

  const post = result.rows[0];

  // Get related posts
  const relatedResult = await query(
    `SELECT p.*
     FROM posts p
     WHERE p.status = 'published' AND p.id != $1
     ORDER BY p.created_at DESC
     LIMIT 3`,
    [post.id]
  );

  return (
    <article className="container py-8 max-w-4xl">
      <Link
        href="/news"
        className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block"
      >
        ← Back to News
      </Link>

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center text-gray-600 mb-4">
          <span>{post.author_name || 'Claim Records'}</span>
          <span className="mx-2">•</span>
          <time>
            {post.published_at
              ? new Date(post.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
          </time>
        </div>
        {post.featured_image && (
          <div className="relative h-96 w-full mb-6 rounded-lg overflow-hidden">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
      </header>

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {relatedResult.rows.length > 0 && (
        <aside className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedResult.rows.map((related: any) => (
              <Link
                key={related.id}
                href={`/news/${related.slug}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-500 transition-colors"
              >
                <h3 className="font-semibold mb-2 line-clamp-2">{related.title}</h3>
                {related.excerpt && (
                  <p className="text-sm text-gray-600 line-clamp-2">{related.excerpt}</p>
                )}
              </Link>
            ))}
          </div>
        </aside>
      )}
    </article>
  );
}


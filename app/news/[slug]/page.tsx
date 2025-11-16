import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';
import { getLoremFlickrUrl, isValidImageUrl } from '@/lib/utils/loremflickr';

export const dynamic = 'force-dynamic';

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
    <article className="container max-w-4xl news" style={{ paddingTop: '2rem', paddingBottom: '2rem', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
      <Link
        href="/news"
        className="text-indigo-600 hover:text-indigo-800 inline-block"
        style={{ marginBottom: '1rem' }}
      >
        ← Back to News
      </Link>

      <header style={{ marginBottom: '2rem' }}>
        <h1 className="text-4xl font-bold" style={{ marginBottom: '1rem', paddingTop: '1rem' }}>{post.title}</h1>
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
        {(() => {
          const imageSrc = isValidImageUrl(post.featured_image) 
            ? post.featured_image 
            : getLoremFlickrUrl(800, 600, 'music,news,article', parseInt(post.id.replace(/\D/g, '').slice(0, 8) || '0', 10));
          return (
            <div className="relative h-96 w-full mb-6 rounded-lg overflow-hidden">
              <Image
                src={imageSrc}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          );
        })()}
      </header>

      <div
        className="prose prose-lg max-w-none"
        style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {relatedResult.rows.length > 0 && (
        <aside style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
          <h2 className="text-2xl font-bold" style={{ marginBottom: '1.5rem', paddingTop: '1rem' }}>Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedResult.rows.map((related: any) => (
              <Link
                key={related.id}
                href={`/news/${related.slug}`}
                className="block border rounded-lg hover:border-indigo-500 transition-colors"
                style={{ padding: '1rem', wordWrap: 'break-word', overflowWrap: 'break-word', borderColor: 'rgb(244, 244, 244)' }}
              >
                <h3 className="font-semibold mb-2" style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.4', maxHeight: '2.8em' }}>{related.title}</h3>
                {related.excerpt && (
                  <p className="text-sm text-gray-600" style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.4', maxHeight: '2.8em' }}>{related.excerpt}</p>
                )}
              </Link>
            ))}
          </div>
        </aside>
      )}
    </article>
  );
}


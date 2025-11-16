import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import Link from 'next/link';
import VideoPlayer from '@/components/videos/VideoPlayer';

export default async function VideoPage({ params }: { params: { slug: string } }) {
  const result = await query(
    `SELECT v.*, a.name as artist_name, a.slug as artist_slug
     FROM videos v
     LEFT JOIN artists a ON v.artist_id = a.id
     WHERE v.slug = $1`,
    [params.slug]
  );

  if (result.rows.length === 0) {
    notFound();
  }

  const video = result.rows[0];

  // Increment view count
  await query('UPDATE videos SET view_count = view_count + 1 WHERE id = $1', [video.id]);

  // Get related videos
  const relatedResult = await query(
    `SELECT v.*, a.name as artist_name, a.slug as artist_slug
     FROM videos v
     LEFT JOIN artists a ON v.artist_id = a.id
     WHERE v.id != $1
     ORDER BY RANDOM()
     LIMIT 4`,
    [video.id]
  );

  const relatedVideos = relatedResult.rows;

  return (
    <div className="container py-8 max-w-6xl">
      <Link
        href="/videos"
        className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block"
      >
        ← Back to Videos
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
          
          {video.artist_name && (
            <p className="text-gray-600 mb-4">
              By{' '}
              <Link
                href={`/artists/${video.artist_slug}`}
                className="text-indigo-600 hover:text-indigo-800"
              >
                {video.artist_name}
              </Link>
            </p>
          )}

          <div className="mb-6">
            <VideoPlayer video={video} />
          </div>

          {video.description && (
            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 whitespace-pre-line">{video.description}</p>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>
              <i className="bi bi-eye me-1"></i>
              {video.view_count} views
            </span>
            <span>
              <i className="bi bi-calendar me-1"></i>
              {new Date(video.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            {video.category && (
              <span>
                <i className="bi bi-tag me-1"></i>
                {video.category}
              </span>
            )}
          </div>
        </div>

        {relatedVideos.length > 0 && (
          <aside>
            <h2 className="text-xl font-bold mb-4">Related Videos</h2>
            <div className="space-y-4">
              {relatedVideos.map((related: any) => (
                <Link
                  key={related.id}
                  href={`/videos/${related.slug}`}
                  className="block hover:opacity-80 transition-opacity"
                >
                  <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-2">
                    {related.thumbnail_url ? (
                      <img
                        src={related.thumbnail_url}
                        alt={related.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">
                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm line-clamp-2">{related.title}</h3>
                  {related.artist_name && (
                    <p className="text-xs text-gray-600">{related.artist_name}</p>
                  )}
                </Link>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}


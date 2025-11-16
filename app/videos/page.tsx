import { query } from '@/lib/db';
import VideoGrid from '@/components/videos/VideoGrid';
import CategoryFilter from '@/components/videos/CategoryFilter';

export default async function VideosPage({
  searchParams,
}: {
  searchParams: { category?: string; artist?: string };
}) {
  // Build query
  let videosQuery = `
    SELECT v.*, a.name as artist_name, a.slug as artist_slug
    FROM videos v
    LEFT JOIN artists a ON v.artist_id = a.id
    WHERE 1=1
  `;
  const params: any[] = [];
  let paramCount = 0;

  if (searchParams.category) {
    paramCount++;
    videosQuery += ` AND v.category = $${paramCount}`;
    params.push(searchParams.category);
  }

  if (searchParams.artist) {
    paramCount++;
    videosQuery += ` AND v.artist_id = $${paramCount}`;
    params.push(searchParams.artist);
  }

  videosQuery += ` ORDER BY v.featured DESC, v.created_at DESC`;

  const result = await query(videosQuery, params);
  const videos = result.rows;

  // Get unique categories for filtering
  const categoriesResult = await query(
    'SELECT DISTINCT category FROM videos WHERE category IS NOT NULL ORDER BY category'
  );
  const categories = categoriesResult.rows.map((r: any) => r.category);

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Videos</h1>

      {/* Filters */}
      {categories.length > 0 && (
        <div className="mb-6">
          <CategoryFilter categories={categories} currentCategory={searchParams.category} />
        </div>
      )}

      {videos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No videos available at this time.</p>
        </div>
      ) : (
        <VideoGrid videos={videos} />
      )}
    </div>
  );
}


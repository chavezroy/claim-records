import { query } from '@/lib/db';
import FeaturedPost from '@/components/content/FeaturedPost';
import PostGrid from '@/components/content/PostGrid';
import Link from 'next/link';
import HeroSection from '@/components/home/HeroSection';
import FeaturedReleases from '@/components/home/FeaturedReleases';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch featured post
  const featuredPostResult = await query(
    `SELECT p.*, u.name as author_name
     FROM posts p
     LEFT JOIN users u ON p.author_id = u.id
     WHERE p.status = 'published' AND p.featured = true
     ORDER BY p.published_at DESC NULLS LAST, p.created_at DESC
     LIMIT 1`
  );

  // Fetch latest posts (excluding featured)
  const latestPostsResult = await query(
    `SELECT p.*, u.name as author_name
     FROM posts p
     LEFT JOIN users u ON p.author_id = u.id
     WHERE p.status = 'published' AND (p.featured = false OR p.featured IS NULL)
     ORDER BY p.published_at DESC NULLS LAST, p.created_at DESC
     LIMIT 6`
  );

  const featuredPost = featuredPostResult.rows[0] || null;
  const latestPosts = latestPostsResult.rows || [];

  return (
    <>
      <HeroSection />

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-12 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center" style={{ marginBottom: '1.5rem', paddingTop: '1rem' }}>Latest News</h2>
            <FeaturedPost post={featuredPost} />
          </div>
        </section>
      )}

      <FeaturedReleases />

      {/* Latest Posts */}
      {latestPosts.length > 0 && (
        <section className="py-12">
          <div className="container">
            <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', paddingTop: '1rem' }}>
              <h2 className="text-3xl font-bold" style={{ marginBottom: 0 }}>Recent Updates</h2>
              <Link
                href="/news"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                View All →
              </Link>
            </div>
            <PostGrid posts={latestPosts} columns={3} />
          </div>
        </section>
      )}
    </>
  );
}


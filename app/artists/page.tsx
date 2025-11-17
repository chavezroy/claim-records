import { query } from '@/lib/db';
import ArtistGridClient from '@/components/artists/ArtistGridClient';
import FeaturedPost from '@/components/content/FeaturedPost';
import PostGrid from '@/components/content/PostGrid';
import Link from 'next/link';
import FeaturedReleases from '@/components/home/FeaturedReleases';

export const dynamic = 'force-dynamic';

export default async function ArtistsPage() {
  // Fetch artists from database
  let result;
  try {
    result = await query(
      'SELECT * FROM artists ORDER BY name ASC'
    );
  } catch (error: any) {
    console.error('Database error in artists page:', error);
    // Log detailed error for debugging
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    throw error;
  }

  const artists = result.rows.map((artist: any) => ({
    id: artist.id,
    name: artist.name,
    slug: artist.slug,
    image: artist.image || artist.profile_image || '/img/artist/default.jpg',
    profileImage: artist.profile_image || artist.image || '/img/artist/default.jpg',
    bio: artist.bio,
    socialLinks: {
      instagram: artist.instagram_url,
      twitter: artist.twitter_url,
      facebook: artist.facebook_url,
      youtube: artist.youtube_url,
    },
  }));

  // Randomize artists on server side to prevent hydration mismatch
  // Fisher-Yates shuffle algorithm
  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  const randomizedArtists = shuffleArray(artists);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  return (
    <>
      <section className="artists relative w-full overflow-hidden" style={{ minHeight: '90vh', marginTop: 0, paddingTop: 0 }}>
        <ArtistGridClient 
          artists={randomizedArtists}
          containerVariants={containerVariants}
          itemVariants={itemVariants}
        />
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-12 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center" style={{ marginBottom: '1.5rem', paddingTop: '1rem' }}>Latest News</h2>
            <FeaturedPost post={featuredPost} />
          </div>
        </section>
      )}

      {/* Featured Releases */}
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


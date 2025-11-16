import { query } from '@/lib/db';
import ArtistGridClient from '@/components/artists/ArtistGridClient';

export default async function ArtistsPage() {
  // Fetch artists from database
  const result = await query(
    'SELECT * FROM artists ORDER BY name ASC'
  );

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
    <section className="artists relative w-full overflow-hidden" style={{ height: '90vh', marginTop: 0, paddingTop: 0 }}>
      <ArtistGridClient 
        artists={artists}
        containerVariants={containerVariants}
        itemVariants={itemVariants}
      />
    </section>
  );
}


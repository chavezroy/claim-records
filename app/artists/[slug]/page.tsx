import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import Card from '@/components/ui/Card';
import ArtistCard from '@/components/artists/ArtistCard';
import MediaSection from '@/components/artists/MediaSection';
import YouMightLike from '@/components/promo/YouMightLike';

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function ArtistDetailPage({ params }: PageProps) {
  // Fetch artist from database
  const artistResult = await query(
    'SELECT * FROM artists WHERE slug = $1',
    [params.slug]
  );

  if (artistResult.rows.length === 0) {
    notFound();
  }

  const artist = artistResult.rows[0];

  // Fetch artist's products (releases)
  const productsResult = await query(
    'SELECT * FROM products WHERE artist_id = $1 ORDER BY created_at DESC',
    [artist.id]
  );

  const releases = productsResult.rows;

  // Fetch other artists
  const otherArtistsResult = await query(
    'SELECT * FROM artists WHERE id != $1 ORDER BY name ASC LIMIT 4',
    [artist.id]
  );

  const otherArtists = otherArtistsResult.rows.map((a: any) => ({
    id: a.id,
    name: a.name,
    slug: a.slug,
    image: a.image || a.profile_image || '/img/artist/default.jpg',
    profileImage: a.profile_image || a.image || '/img/artist/default.jpg',
  }));

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="carousel carousel-dark slide bg-black">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <div className="relative h-[70vh] flex items-center justify-center">
                <Image
                  src={artist.profile_image || artist.image || '/img/artist/default.jpg'}
                  alt={artist.name}
                  width={1200}
                  height={800}
                  unoptimized
                  className="d-block w-full md:w-3/5 opacity-75 object-cover h-full"
                />
                <div className="carousel-caption d-md-block absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center text-center">
                  <h5 className="text-white text-2xl md:text-4xl mb-4">{artist.name}</h5>
                  {artist.bio && (
                    <p className="text-gray-300 mb-4 max-w-2xl px-4">{artist.bio}</p>
                  )}
                  <div className="share-buttons">
                    <div className="mb-3 row">
                      <span className="section-title col-sm-2 text-white">Share</span>
                      <div className="col-sm-10 flex gap-4">
                        {artist.instagram_url && (
                          <a target="_blank" href={artist.instagram_url} className="text-white text-2xl hover:text-primary">
                            <i className="bi bi-instagram"></i>
                          </a>
                        )}
                        {artist.twitter_url && (
                          <a target="_blank" href={artist.twitter_url} className="text-white text-2xl hover:text-primary">
                            <i className="bi bi-twitter-x"></i>
                          </a>
                        )}
                        {artist.facebook_url && (
                          <a target="_blank" href={artist.facebook_url} className="text-white text-2xl hover:text-primary">
                            <i className="bi bi-facebook"></i>
                          </a>
                        )}
                        {artist.youtube_url && (
                          <a target="_blank" href={artist.youtube_url} className="text-white text-2xl hover:text-primary">
                            <i className="bi bi-youtube"></i>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* Releases Section */}
            {releases.length > 0 && (
              <section>
                <div className="container pt-5 releases">
                  <h2 className="text-center mb-5">Releases</h2>
                  <div className="row mb-5">
              {releases.map((release) => (
                <div key={release.id} className="col-sm-4 mb-3 mb-sm-0">
                  <Card href="#">
                    <div className="thumb relative w-full overflow-hidden bg-white" style={{ height: '340px' }}>
                      <Image
                        src={release.artwork}
                        alt={release.title}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                        style={{ 
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          left: 0,
                          top: 0,
                          transform: 'none'
                        }}
                      />
                    </div>
                    <div className="card-body p-5 min-h-[110px]">
                      <p className="card-title mb-0 text-primary hover:text-black transition-colors">{release.artistName}</p>
                      <p className="card-subtitle mb-2 text-gray-500 text-sm">
                        {release.title}{' '}
                        <span className="badge badge-warning bg-yellow-400 text-black px-2 py-1 text-xs">
                          {release.type.toUpperCase()}
                        </span>
                      </p>
                      <div className="share-buttons">
                        <div className="row">
                          <span className="section-title col-sm-2 text-sm">Listen on</span>
                          <div className="col-sm-10 flex gap-2">
                            <a target="_blank" href={release.streamingLinks?.appleMusic || '#'} className="text-xl hover:text-primary">
                              <i className="bi bi-apple"></i>
                            </a>
                            <a target="_blank" href={release.streamingLinks?.spotify || '#'} className="text-xl hover:text-primary">
                              <i className="bi bi-spotify"></i>
                            </a>
                            <a target="_blank" href={release.streamingLinks?.amazon || '#'} className="text-xl hover:text-primary">
                              <i className="bi bi-amazon"></i>
                            </a>
                            <a target="_blank" href={release.streamingLinks?.youtube || '#'} className="text-xl hover:text-primary">
                              <i className="bi bi-youtube"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Media Section */}
      <section className="py-12">
        <div className="container">
          <MediaSection artistId={artist.id} />
        </div>
      </section>

      {/* Other Artists */}
      <section>
        <div className="container pt-5 others">
          <h2 className="text-center mb-5">Check out other Artists</h2>
          <div className="row mb-5">
            {otherArtists.map((otherArtist) => (
              <div key={otherArtist.id} className="col-sm-3 mb-3 mb-sm-0">
                <ArtistCard artist={otherArtist} variant="card" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Cards */}
      <YouMightLike
        type="artists"
        limit={4}
        currentArtistId={artist.id}
        excludeIds={otherArtists.map((a) => a.id)}
      />
    </>
  );
}


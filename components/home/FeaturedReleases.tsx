'use client';

import Image from 'next/image';
import { getFeaturedReleases } from '@/lib/data/releases';
import Card from '@/components/ui/Card';

export default function FeaturedReleases() {
  const featuredReleases = getFeaturedReleases();

  return (
    <section>
      <div className="container pt-5">
        <h2 className="text-center mb-5">Featured</h2>
        <div className="row mb-5 justify-content-start">
          {featuredReleases.slice(0, 4).map((release) => (
            <div
              key={release.id}
              className="col-sm-3 mb-3 mb-sm-0 max-w-[300px] mx-auto md:max-w-none md:mx-0"
            >
              <Card href={`/artists/${release.artistId}`}>
                <div className="thumb featured-thumb-container relative w-full overflow-hidden bg-white h-[250px] md:h-[400px]">
                  <Image
                    src={release.artwork}
                    alt={release.title}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover featured-thumb-mobile md:featured-thumb-desktop"
                  />
                </div>
                <div className="card-body p-5 min-h-[110px]">
                  <p className="card-title mb-0 text-primary hover:text-black transition-colors">
                    {release.artistName}
                  </p>
                  <p className="card-subtitle mb-2 text-gray-500 text-sm">
                    {release.type === 'single'
                      ? 'Single'
                      : release.type === 'ep'
                      ? 'EP'
                      : 'Album'}{' '}
                    - {release.title}
                  </p>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


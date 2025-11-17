'use client';

import Image from 'next/image';
import { getFeaturedReleases } from '@/lib/data/releases';
import Card from '@/components/ui/Card';

export default function FeaturedReleases() {
  const featuredReleases = getFeaturedReleases();

  return (
    <section>
      <div className="container mx-auto px-4 pt-5">
        <h2 className="text-center mb-5">Featured</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {featuredReleases.slice(0, 4).map((release) => (
            <div
              key={release.id}
              className="max-w-[300px] mx-auto sm:max-w-none sm:mx-0"
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
                <div className="p-5 min-h-[110px]">
                  <p className="text-lg font-semibold mb-0 text-primary hover:text-black transition-colors">
                    {release.artistName}
                  </p>
                  <p className="text-sm mb-2 text-gray-500">
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


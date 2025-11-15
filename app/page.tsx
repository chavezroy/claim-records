'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { artists } from '@/lib/data/artists';
import { getFeaturedReleases } from '@/lib/data/releases';
import Card from '@/components/ui/Card';

export default function HomePage() {
  const featuredReleases = getFeaturedReleases();

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
      {/* Hero Section with Thumbs Grid */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* Hero Grid - 3 columns, 2 rows, equal squares */}
        <motion.div
          className="hero-grid absolute inset-0 h-screen w-full"
          data-framer-component
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {artists.slice(0, 6).map((artist, index) => {
            const filter = index % 2 === 0 ? 'sepia(80%)' : 'grayscale(100%)';
            
            return (
              <motion.div
                key={`hero-grid-${artist.id}`}
                className="relative w-full h-full overflow-hidden bg-white"
                data-framer-component
                variants={itemVariants}
                style={{
                  willChange: 'transform, opacity',
                  backfaceVisibility: 'hidden',
                }}
              >
                <Image
                  src={artist.image}
                  alt={artist.name}
                  fill
                  unoptimized
                  className="object-cover opacity-25"
                  style={{ 
                    filter,
                    willChange: 'auto',
                    transform: 'translateZ(0)',
                  }}
                  priority={index < 3}
                />
              </motion.div>
            );
          })}
        </motion.div>
        
        {/* Logo Overlay */}
        <motion.div
          className="absolute z-10 px-10 w-80 md:w-96 top-8 md:top-1/4 left-1/2 -translate-x-1/2"
          data-framer-component
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.4,
            ease: [0.25, 0.1, 0.25, 1] as const,
          }}
          style={{
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
          }}
        >
          <Image
            src="/img/logo_ClaimRecords.svg"
            alt="Claim Records"
            width={600}
            height={200}
            className="w-full"
            priority
          />
        </motion.div>
      </div>

      {/* Featured Releases */}
      <section>
        <div className="container pt-5">
          <h2 className="text-center">Featured</h2>
          <div className="row mb-5">
            {featuredReleases.map((release) => (
              <div key={release.id} className="col-sm-4 mb-3 mb-sm-0">
                <Card href={`/artists/${release.artistId}`}>
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
                        transform: 'none',
                      }}
                    />
                  </div>
                  <div className="card-body p-5 min-h-44">
                    <p className="card-title mb-0 text-primary hover:text-black transition-colors">{release.artistName}</p>
                    <p className="card-subtitle mb-2 text-gray-500 text-sm">
                      {release.type === 'single' ? 'Single' : release.type === 'ep' ? 'EP' : 'Album'} - {release.title}
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}


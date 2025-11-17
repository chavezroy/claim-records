'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { artists } from '@/lib/data/artists';
import BrandLogo from '@/components/logo/BrandLogo';

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function ComingSoonPage() {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [randomizedArtists, setRandomizedArtists] = useState<typeof artists>([]);
  
  // Randomize artists only on client side after mount to avoid hydration mismatch
  useEffect(() => {
    setRandomizedArtists(shuffleArray(artists).slice(0, 6));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 1.5,
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

  const handleImageError = (artistId: string) => {
    setImageErrors(prev => ({ ...prev, [artistId]: true }));
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <motion.div
        className="hero-grid absolute inset-0 h-screen w-full"
        data-framer-component
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {randomizedArtists.map((artist, index) => {
          const filter = index % 2 === 0 ? 'sepia(80%)' : 'grayscale(100%)';
          const imageError = imageErrors[artist.id];
          const imageSrc = imageError ? '/img/artist/default.jpg' : artist.image;

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
              {!imageError ? (
                <Image
                  src={imageSrc}
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
                  onError={() => handleImageError(artist.id)}
                />
              ) : (
                <div 
                  className="w-full h-full bg-gray-200 opacity-25"
                  style={{ filter }}
                />
              )}
            </motion.div>
          );
        })}
      </motion.div>

      <div className="absolute z-10 left-1/2 hero-section-logo-wrapper">
        <BrandLogo showAnimation={true} animationDelay={1.5} animateOnHover={true} />
      </div>
    </div>
  );
}


'use client';

import { motion, Variants } from 'framer-motion';
import { Artist } from '@/lib/types/artist';
import ArtistCard from './ArtistCard';

type ArtistGridProps = {
  artists: Artist[];
  variant?: 'grid' | 'card';
  containerVariants?: Variants;
  itemVariants?: Variants;
};

export default function ArtistGrid({ 
  artists, 
  variant = 'grid',
  containerVariants,
  itemVariants,
}: ArtistGridProps) {
  if (variant === 'grid' && containerVariants && itemVariants) {
    // Hero-style grid layout
    return (
      <motion.div
        className="hero-grid absolute inset-0 h-[50vh] md:h-screen w-full"
        data-framer-component
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {artists.slice(0, 6).map((artist, index) => (
          <ArtistCard 
            key={artist.id} 
            artist={artist} 
            variant={variant}
            index={index}
            itemVariants={itemVariants}
          />
        ))}
      </motion.div>
    );
  }

  // Fallback to original flex layout for card variant
  return (
    <div 
      className="artist thumbs animate-fade-in"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        position: 'relative',
      }}
    >
      {artists.map((artist) => (
        <ArtistCard key={artist.id} artist={artist} variant={variant} />
      ))}
    </div>
  );
}


'use client';

import { motion, Variants } from 'framer-motion';
import { Artist } from '@/lib/types/artist';
import ArtistCard from './ArtistCard';

type ArtistGridClientProps = {
  artists: Artist[];
  containerVariants?: Variants;
  itemVariants?: Variants;
};

export default function ArtistGridClient({ 
  artists, 
  containerVariants,
  itemVariants,
}: ArtistGridClientProps) {
  if (containerVariants && itemVariants) {
    // Ensure we have exactly 6 artists for the hero grid (3x2 layout)
    const displayArtists = artists.slice(0, 6);
    
    return (
      <motion.div
        className="hero-grid absolute w-full"
        data-framer-component
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          maxWidth: '1140px',
          height: '70vh',
          margin: 'auto',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        }}
      >
        {displayArtists.map((artist, index) => (
          <ArtistCard 
            key={artist.id} 
            artist={artist} 
            variant="grid"
            index={index}
            itemVariants={itemVariants}
          />
        ))}
      </motion.div>
    );
  }

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
        <ArtistCard key={artist.id} artist={artist} variant="grid" />
      ))}
    </div>
  );
}


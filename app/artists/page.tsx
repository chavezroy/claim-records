'use client';

import { motion } from 'framer-motion';
import { artists } from '@/lib/data/artists';
import ArtistGrid from '@/components/artists/ArtistGrid';

export default function ArtistsPage() {
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
    <section className="artists relative h-screen w-full overflow-hidden">
      <ArtistGrid 
        artists={artists} 
        containerVariants={containerVariants}
        itemVariants={itemVariants}
      />
    </section>
  );
}


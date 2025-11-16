'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { artists } from '@/lib/data/artists';
import AnimatedLogo from '@/components/logo/AnimatedLogo';

export default function HeroSection() {
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

  return (
    <div className="relative h-[50vh] md:h-screen w-full overflow-hidden">
      <motion.div
        className="hero-grid absolute inset-0 h-[50vh] md:h-screen w-full"
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

      <div className="absolute z-10 left-1/2 top-[47.5%] -translate-x-1/2 -translate-y-1/2">
        <AnimatedLogo />
      </div>
    </div>
  );
}


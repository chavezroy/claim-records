'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { useState } from 'react';
import Card from '@/components/ui/Card';
import { Artist } from '@/lib/types/artist';

type ArtistCardProps = {
  artist: Artist;
  variant?: 'grid' | 'card';
  showBio?: boolean;
  index?: number;
  itemVariants?: Variants;
};

export default function ArtistCard({ 
  artist, 
  variant = 'grid', 
  showBio = false,
  index = 0,
  itemVariants,
}: ArtistCardProps) {
  // For grid view (artists landing page), use the hero-style grid layout
  if (variant === 'grid' && itemVariants) {
    const baseFilter = 'grayscale(100%)';
    const [isLabelHovered, setIsLabelHovered] = useState(false);
    
    return (
      <motion.div
        className="group relative w-full h-full overflow-hidden bg-white"
        data-framer-component
        variants={itemVariants}
        style={{
          willChange: 'opacity, filter',
          backfaceVisibility: 'hidden',
        }}
      >
        <Link 
          href={`/artists/${artist.slug}`} 
          className="block w-full h-full relative no-underline"
          style={{ transition: 'none' }}
        >
          <motion.div
            className="absolute inset-0"
            whileHover={isLabelHovered ? {} : { 
              filter: 'none',
              opacity: 1,
              scale: 1.1,
            }}
            animate={isLabelHovered ? {
              filter: 'none',
              opacity: 1,
              scale: 1.1,
            } : undefined}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const }}
            style={{
              filter: baseFilter,
              opacity: 0.55,
              willChange: 'transform, filter, opacity',
            }}
          >
            <Image
              src={artist.image}
              alt={artist.name}
              fill
              unoptimized
              className="object-cover"
              style={{ 
                willChange: 'auto',
                transform: 'translateZ(0)',
                transition: 'none',
              }}
              priority={index < 3}
            />
          </motion.div>
          <span 
            className="artist__name group-hover:opacity-100"
            onMouseEnter={(e) => {
              e.stopPropagation();
              setIsLabelHovered(true);
            }}
            onMouseLeave={(e) => {
              e.stopPropagation();
              setIsLabelHovered(false);
            }}
            style={{ 
              transition: 'opacity 0.15s linear',
              pointerEvents: 'auto',
            }}
          >
            {artist.name}
          </span>
        </Link>
      </motion.div>
    );
  }

  // Legacy grid view (fallback)
  if (variant === 'grid') {
    return (
      <div 
        className="thumb relative overflow-hidden bg-white border-none"
        style={{
          flex: '0 0 33.333333%',
          width: '33.333333%',
          position: 'relative',
          minHeight: '100%',
        }}
      >
        <Link 
          href={`/artists/${artist.slug}`} 
          style={{ 
            display: 'block', 
            width: '100%', 
            height: '100%', 
            position: 'relative',
            textDecoration: 'none',
          }}
        >
          <div className="relative w-full h-full" style={{ width: '100%', height: '100%', minHeight: '400px' }}>
            <Image
              src={artist.image}
              alt={artist.name}
              fill
              unoptimized
              className="artwork"
              style={{
                position: 'absolute',
                height: '100%',
                transform: 'translate(-50%, -50%)',
                left: '50%',
                top: '50%',
                zIndex: 0,
                filter: 'sepia(80%)',
                opacity: 0.55,
                transition: 'all 0.3s ease',
                objectFit: 'cover',
              }}
            />
            <span className="artist__name">
              {artist.name}
            </span>
          </div>
        </Link>
      </div>
    );
  }

  // For card view (standard card layout matching ProductCard)
  return (
    <Card href={`/artists/${artist.slug}`}>
      <div className="thumb relative w-full overflow-hidden bg-white" style={{ height: '200px' }}>
        <Image
          src={artist.image}
          alt={artist.name}
          fill
          unoptimized
                sizes="(max-width: 768px) 100vw, 25vw"
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
      <div className="card-body p-5 min-h-[110px]" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
        <p className="card-title mb-0 text-primary hover:text-black transition-colors" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {artist.name}
        </p>
        {showBio && artist.bio && (
          <p className="card-subtitle mb-2 text-gray-500 text-sm" style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.4', maxHeight: '2.8em' }}>
            {artist.bio}
          </p>
        )}
        <p className="text-sm text-gray-400 mb-0">
          View Artist →
        </p>
      </div>
    </Card>
  );
}

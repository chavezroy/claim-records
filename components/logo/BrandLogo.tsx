'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import LogoIcon from './LogoIcon';

interface BrandLogoProps {
  className?: string;
  showAnimation?: boolean;
  animationDelay?: number;
}

export default function BrandLogo({ 
  className = '', 
  showAnimation = false,
  animationDelay = 0 
}: BrandLogoProps) {
  const containerContent = (
    <div className={`hero-logo-container ${className}`}>
      <div className="hero-logo-icon">
        <LogoIcon />
      </div>
      <div className="hero-logo-text">
        <Image
          src="/img/logo-text.svg"
          alt="Claim Records"
          width={400}
          height={120}
          priority
          unoptimized
        />
      </div>
    </div>
  );

  if (showAnimation) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: animationDelay }}
        style={{
          willChange: 'opacity',
          backfaceVisibility: 'hidden',
        }}
      >
        {containerContent}
      </motion.div>
    );
  }

  return containerContent;
}


'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import LogoIcon from './LogoIcon';

interface BrandLogoProps {
  className?: string;
  showAnimation?: boolean;
  animationDelay?: number;
  variant?: 'hero' | 'header';
  animateOnHover?: boolean;
}

export default function BrandLogo({ 
  className = '', 
  showAnimation = false,
  animationDelay = 0,
  variant = 'hero',
  animateOnHover = false
}: BrandLogoProps) {
  const containerClass = variant === 'header' 
    ? `header-logo-container ${className}`
    : `hero-logo-container ${className}`;
    
  const containerContent = (
    <div className={containerClass}>
      <div className={variant === 'header' ? 'header-logo-icon' : 'hero-logo-icon'}>
        <LogoIcon 
          animateOnHover={animateOnHover} 
          animationStartDelay={showAnimation ? animationDelay + 0.3 : 0}
        />
      </div>
      <div className={variant === 'header' ? 'header-logo-text' : 'hero-logo-text'}>
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
        transition={{ 
          duration: 0.3, 
          delay: animationDelay,
          ease: [0.25, 0.1, 0.25, 1] as const
        }}
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


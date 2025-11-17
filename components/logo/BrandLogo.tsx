'use client';

import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { useState } from 'react';
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
  const [isHovered, setIsHovered] = useState(false);
  const containerClass = variant === 'header' 
    ? `header-logo-container ${className}`
    : `hero-logo-container ${className}`;

  // Entrance animation variants - first example with proper implementation
  // Removed staggerChildren - manually controlling delays for precise timing
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: animationDelay,
      },
    },
  };

  // Icon entrance: scale + slight rotation from center
  // Icon starts immediately after delayChildren (no additional delay)
  const iconVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.5,
      rotate: -10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        delay: 0, // Starts immediately after delayChildren
        ease: [0.25, 0.1, 0.25, 1] as const,
        opacity: {
          duration: 0.3,
          ease: [0.25, 0.1, 0.25, 1] as const,
        },
        scale: {
          duration: 0.6,
          ease: [0.25, 0.1, 0.25, 1] as const,
        },
        rotate: {
          duration: 0.6,
          ease: [0.25, 0.1, 0.25, 1] as const,
        },
      },
    },
  };

  // Text entrance: bottom-to-top mask reveal
  // Icon starts at: delayChildren (animationDelay) + 0
  // Icon duration: 0.6s
  // Icon ends at: animationDelay + 0.6
  // Text should start at: animationDelay + 0.6 (when icon ends)
  // Since we're using initial/animate directly (not variants), we need total delay
  const iconDuration = 0.6;
  const textTotalDelay = animationDelay + iconDuration; // Total delay from page load
    
  const containerContent = (
    <motion.div 
      className={containerClass}
      data-framer-component
      variants={showAnimation ? containerVariants : undefined}
      initial={showAnimation ? 'hidden' : false}
      animate={showAnimation ? 'visible' : false}
      onHoverStart={() => animateOnHover && setIsHovered(true)}
      onHoverEnd={() => animateOnHover && setIsHovered(false)}
      style={{
        transformOrigin: 'center center',
      }}
    >
      <motion.div 
        className={variant === 'header' ? 'header-logo-icon' : 'hero-logo-icon'}
        data-framer-component
        variants={showAnimation ? iconVariants : undefined}
        style={{
          transformOrigin: 'center center',
        }}
      >
        <LogoIcon 
          animateOnHover={animateOnHover} 
          isHovered={isHovered}
          animationStartDelay={showAnimation ? animationDelay + 0.75 : 0}
        />
      </motion.div>
      <motion.div 
        className={variant === 'header' ? 'header-logo-text' : 'hero-logo-text'}
        data-framer-component
        initial={showAnimation ? {
          opacity: 0,
          clipPath: 'inset(100% 0 0 0)',
          scale: 0.9,
          filter: 'blur(10px)',
        } : false}
        animate={showAnimation ? {
          opacity: 1,
          clipPath: 'inset(0% 0 0 0)',
          scale: 1,
          filter: 'blur(0px)',
        } : false}
        transition={showAnimation ? {
          duration: 0.5,
          delay: textTotalDelay,
          ease: [0.25, 0.1, 0.25, 1] as const,
          opacity: {
            duration: 0.4,
            delay: textTotalDelay,
            ease: [0.25, 0.1, 0.25, 1] as const,
          },
          clipPath: {
            duration: 0.5,
            delay: textTotalDelay,
            ease: [0.25, 0.1, 0.25, 1] as const,
          },
          scale: {
            duration: 0.5,
            delay: textTotalDelay,
            ease: [0.25, 0.1, 0.25, 1] as const,
          },
          filter: {
            duration: 0.5,
            delay: textTotalDelay,
            ease: [0.25, 0.1, 0.25, 1] as const,
          },
        } : undefined}
        style={{
          transformOrigin: 'center center',
        }}
      >
        <Image
          src="/img/logo-text.svg"
          alt="Claim Records"
          width={400}
          height={120}
          priority
          unoptimized
        />
      </motion.div>
    </motion.div>
  );

  return containerContent;
}


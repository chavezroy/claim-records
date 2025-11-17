'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface LogoTextProps {
  className?: string;
  animateOnHover?: boolean;
  isHovered?: boolean;
  animationStartDelay?: number;
  showAnimation?: boolean;
  textTotalDelay?: number;
  autoAnimate?: boolean; // If true, animation plays automatically without hover
}

export default function LogoText({ 
  className = '', 
  animateOnHover = false, 
  isHovered = false, 
  animationStartDelay = 0,
  showAnimation = false,
  textTotalDelay = 0,
  autoAnimate = false
}: LogoTextProps) {
  return (
    <motion.div 
      className={`relative logo-text-container ${className}`}
      data-framer-component
      initial={showAnimation ? {
        opacity: 0,
        scale: 0.9,
        filter: 'blur(10px)',
      } : {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
      }}
      animate={showAnimation ? {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
      } : {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
      }}
      transition={showAnimation ? {
        duration: 1.2,
        delay: animationStartDelay + 0.6, // Stagger: starts after letter O completes (0.6s duration)
        ease: [0.43, 0, 0.17, 1] as const, // Slow, smooth ease-out
        opacity: {
          duration: 1.0,
          delay: animationStartDelay + 0.6,
          ease: [0.43, 0, 0.17, 1] as const,
        },
        scale: {
          duration: 1.2,
          delay: animationStartDelay + 0.6,
          ease: [0.43, 0, 0.17, 1] as const, // Slow, smooth ease-out
        },
        filter: {
          duration: 1.2,
          delay: animationStartDelay + 0.6,
          ease: [0.43, 0, 0.17, 1] as const,
        },
      } : undefined}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '70px', /* Ensure minimum height */
        overflow: 'visible',
        transformOrigin: 'center center',
      }}
    >
      {/* Base layer: Main logo text (without O) - staggered after container animation */}
      <motion.div
        data-framer-component
        initial={showAnimation ? { opacity: 0 } : { opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={showAnimation ? {
          duration: 1.0,
          delay: animationStartDelay + 0.6 + 1.2, // Stagger: starts after container animation completes (0.6s O + 1.2s container)
          ease: [0.43, 0, 0.17, 1] as const, // Slow, smooth ease-out
        } : {
          duration: 0,
        }}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          width: '100%',
          height: '100%',
          minHeight: '70px',
        }}
      >
        <Image
          src="/claim-logo-text/logo-text.svg"
          alt=""
          fill
          className="object-contain"
          priority
          unoptimized
        />
      </motion.div>
      
      {/* O Group Container: Wraps letter O and oShine - entrance animation first */}
      <motion.div
        data-framer-component
        className="logo-o-group"
        initial={showAnimation ? {
          opacity: 0,
          scale: 0.8,
        } : {
          opacity: 1,
          scale: 1,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        style={{
          position: 'absolute',
          width: 'fit-content',
          height: 'fit-content',
          top: '55px',
          left: '133px',
          transformOrigin: 'center center',
          zIndex: 2,
        }}
        transition={{
          duration: 0.6,
          delay: animationStartDelay,
          ease: [0.25, 0.1, 0.25, 1] as const,
        }}
      >
        {/* Letter O shape - hugs contents */}
        <div
          className="logo-letter-o"
          style={{
            position: 'relative',
            width: 'fit-content',
            height: 'fit-content',
            zIndex: 1,
          }}
        >
          <Image
            src="/claim-logo-text/letterO.svg"
            alt=""
            width={68}
            height={68}
            className="object-contain logo-letter-o-img"
            style={{
              width: '68px',
              height: '68px',
              objectFit: 'contain',
            }}
            priority
            unoptimized
          />
        </div>
        
        {/* O shine effect - positioned at top right */}
        <motion.div
          data-framer-component
          className="logo-o-shine"
          style={{
            position: 'absolute',
            width: '55px',
            height: '30px',
            top: '2px',
            right: '-11px',
            zIndex: 2,
          }}
          animate={(autoAnimate || (animateOnHover && isHovered)) ? {
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.02, 1],
          } : {
            opacity: 0.3,
            scale: 1,
          }}
          whileHover={animateOnHover && !autoAnimate ? {
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.02, 1],
          } : undefined}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
            delay: animationStartDelay + 0.6, // Start after O group entrance completes
          }}
        >
          <Image
            src="/claim-logo-text/oShine.svg"
            alt=""
            fill
            className="object-contain"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
            priority
            unoptimized
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}


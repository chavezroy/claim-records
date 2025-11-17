'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface LogoIconProps {
  className?: string;
  animateOnHover?: boolean;
  animationStartDelay?: number;
}

export default function LogoIcon({ className = '', animateOnHover = false, animationStartDelay = 0 }: LogoIconProps) {
  return (
    <div 
      className={`relative logo-icon-container ${className}`}
    >
      {/* Background - bottom layer */}
      <Image
        src="/claim-icon/ico-bg.svg"
        alt=""
        fill
        className="object-contain"
        style={{ 
          zIndex: 1,
          filter: 'drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3))'
        }}
        priority
        unoptimized
      />
      
      {/* Lines - second layer */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          overflow: 'visible',
        }}
        animate={animateOnHover ? undefined : {
          scale: [0.97, 1.03, 0.97], // Start at 97% size, grow to 103%, back to 97%
        }}
        whileHover={animateOnHover ? {
          scale: [0.97, 1.03, 0.97],
        } : undefined}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
          delay: animationStartDelay,
        }}
      >
        <Image
          src="/claim-icon/ico-lines.svg"
          alt=""
          fill
          className="object-contain"
          priority
          unoptimized
        />
      </motion.div>
      
      {/* Hand and Flag - grouped (hand is parent, flag is child) */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
        }}
        animate={animateOnHover ? undefined : {
          x: [0, -1, 1, -0.5, 0.5, -0.3, 0.3, 0],
          y: [0, 0.5, -0.5, 0.3, -0.3, 0.2, -0.2, 0],
          rotate: [0, -0.3, 0.3, -0.2, 0.2, -0.1, 0.1, 0],
        }}
        whileHover={animateOnHover ? {
          x: [0, -1, 1, -0.5, 0.5, -0.3, 0.3, 0],
          y: [0, 0.5, -0.5, 0.3, -0.3, 0.2, -0.2, 0],
          rotate: [0, -0.3, 0.3, -0.2, 0.2, -0.1, 0.1, 0],
        } : undefined}
        whileTap={animateOnHover ? {
          x: [0, -1, 1, -0.5, 0.5, -0.3, 0.3, 0],
          y: [0, 0.5, -0.5, 0.3, -0.3, 0.2, -0.2, 0],
          rotate: [0, -0.3, 0.3, -0.2, 0.2, -0.1, 0.1, 0],
        } : undefined}
        transition={{
          duration: 1.25,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
          delay: animationStartDelay,
        }}
      >
        {/* Hand - parent layer */}
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Image
            src="/claim-icon/ico-hand.svg"
            alt=""
            fill
            className="object-contain"
            style={{ 
              zIndex: 4,
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
            }}
            priority
            unoptimized
          />
          {/* Shine gradient overlay - clipped to hand image */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 5,
              background: 'linear-gradient(135deg, transparent 0%, transparent 40%, rgba(255, 255, 255, 0.6) 50%, transparent 60%, transparent 100%)',
              backgroundSize: '200% 200%',
              mixBlendMode: 'overlay',
              pointerEvents: 'none',
              maskImage: 'url(/claim-icon/ico-hand.svg)',
              WebkitMaskImage: 'url(/claim-icon/ico-hand.svg)',
              maskSize: 'contain',
              WebkitMaskSize: 'contain',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskPosition: 'center',
            }}
            animate={animateOnHover ? undefined : {
              backgroundPosition: ['200% 200%', '-200% -200%'],
            }}
            whileHover={animateOnHover ? {
              backgroundPosition: ['200% 200%', '-200% -200%'],
            } : undefined}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 7.5, // Average of 7-9 seconds
              ease: 'easeInOut',
              delay: animationStartDelay,
            }}
          />
        </div>
        
        {/* Flag - child layer (moves independently but also affected by hand) */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
          }}
          animate={animateOnHover ? undefined : {
            rotate: [0, 1, -1, 0],
            transformOrigin: 'bottom left',
          }}
          whileHover={animateOnHover ? {
            rotate: [0, 1, -1, 0],
            transformOrigin: 'bottom left',
          } : undefined}
          whileTap={animateOnHover ? {
            rotate: [0, 1, -1, 0],
            transformOrigin: 'bottom left',
          } : undefined}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
            delay: animationStartDelay,
          }}
        >
          <Image
            src="/claim-icon/ico-flag.svg"
            alt=""
            fill
            className="object-contain"
            style={{ 
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
            }}
            priority
            unoptimized
          />
        </motion.div>
      </motion.div>
    </div>
  );
}


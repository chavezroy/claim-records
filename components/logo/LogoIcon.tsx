'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface LogoIconProps {
  className?: string;
}

export default function LogoIcon({ className = '' }: LogoIconProps) {
  return (
    <div 
      className={`relative ${className}`}
      style={{
        width: '250px',
        height: '215px',
      }}
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
        animate={{
          scale: [0.97, 1.03, 0.97], // Start at 97% size, grow to 103%, back to 97%
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
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
        animate={{
          x: [0, -1, 1, -0.5, 0.5, -0.3, 0.3, 0],
          y: [0, 0.5, -0.5, 0.3, -0.3, 0.2, -0.2, 0],
          rotate: [0, -0.3, 0.3, -0.2, 0.2, -0.1, 0.1, 0],
        }}
        transition={{
          duration: 1.25,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
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
            animate={{
              backgroundPosition: ['200% 200%', '-200% -200%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 7.5, // Average of 7-9 seconds
              ease: 'easeInOut',
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
          animate={{
            rotate: [0, 1, -1, 0],
            transformOrigin: 'bottom left',
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
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


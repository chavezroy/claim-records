'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface LogoIconProps {
  className?: string;
  animateOnHover?: boolean;
  isHovered?: boolean;
  animationStartDelay?: number;
}

export default function LogoIcon({ className = '', animateOnHover = false, isHovered = false, animationStartDelay = 0 }: LogoIconProps) {
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
        data-framer-component
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          overflow: 'visible',
        }}
        animate={animateOnHover ? (isHovered ? {
          scale: [0.97, 1.03, 0.97], // Start at 97% size, grow to 103%, back to 97%
          rotate: [-2, 2, -2], // Rotate opposite direction
        } : undefined) : {
          scale: [0.97, 1.03, 0.97], // Start at 97% size, grow to 103%, back to 97%
          rotate: [-2, 2, -2], // Rotate opposite direction
        }}
        whileHover={animateOnHover ? {
          scale: [0.97, 1.03, 0.97],
          rotate: [-2, 2, -2],
        } : undefined}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
          delay: animationStartDelay + 0.5,
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
        data-framer-component
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
        }}
        animate={animateOnHover ? (isHovered ? {
          x: [0, -1, 1, -0.5, 0.5, -0.3, 0.3, 0],
          y: [0, 0.5, -0.5, 0.3, -0.3, 0.2, -0.2, 0],
          rotate: [0, 0.3, -0.3, 0.2, -0.2, 0.1, -0.1, 0], // Reversed rotation direction
        } : undefined) : {
          x: [0, -1, 1, -0.5, 0.5, -0.3, 0.3, 0],
          y: [0, 0.5, -0.5, 0.3, -0.3, 0.2, -0.2, 0],
          rotate: [0, 0.3, -0.3, 0.2, -0.2, 0.1, -0.1, 0], // Reversed rotation direction
        }}
        whileHover={animateOnHover ? {
          x: [0, -1, 1, -0.5, 0.5, -0.3, 0.3, 0],
          y: [0, 0.5, -0.5, 0.3, -0.3, 0.2, -0.2, 0],
          rotate: [0, 0.3, -0.3, 0.2, -0.2, 0.1, -0.1, 0], // Reversed rotation direction
        } : undefined}
        whileTap={animateOnHover ? {
          x: [0, -1, 1, -0.5, 0.5, -0.3, 0.3, 0],
          y: [0, 0.5, -0.5, 0.3, -0.3, 0.2, -0.2, 0],
          rotate: [0, 0.3, -0.3, 0.2, -0.2, 0.1, -0.1, 0], // Reversed rotation direction
        } : undefined}
        transition={{
          duration: 1.25,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
          delay: animationStartDelay + 0.5,
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
            data-framer-component
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
            animate={animateOnHover ? (isHovered ? {
              backgroundPosition: ['200% 200%', '-200% -200%'],
            } : undefined) : {
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
              delay: animationStartDelay + 0.5,
            }}
          />
        </div>
        
        {/* Flag - child layer (moves independently but also affected by hand) */}
        <motion.div
          data-framer-component
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            transformOrigin: 'top left',
          }}
          animate={animateOnHover ? (isHovered ? {
            rotate: [0, -1, 1, 0], // Reversed rotation direction
            scaleX: [1, 1.02, 0.98, 1], // Slight horizontal stretch
            scaleY: [1, 1.02, 0.98, 1], // Slight vertical stretch
            transformOrigin: 'top left',
          } : undefined) : {
            rotate: [0, -1, 1, 0], // Reversed rotation direction
            scaleX: [1, 1.02, 0.98, 1], // Slight horizontal stretch
            scaleY: [1, 1.02, 0.98, 1], // Slight vertical stretch
            transformOrigin: 'top left',
          }}
          whileHover={animateOnHover ? {
            rotate: [0, -1, 1, 0], // Reversed rotation direction
            scaleX: [1, 1.02, 0.98, 1],
            scaleY: [1, 1.02, 0.98, 1],
            transformOrigin: 'top left',
          } : undefined}
          whileTap={animateOnHover ? {
            rotate: [0, -1, 1, 0], // Reversed rotation direction
            scaleX: [1, 1.02, 0.98, 1],
            scaleY: [1, 1.02, 0.98, 1],
            transformOrigin: 'top left',
          } : undefined}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
            delay: animationStartDelay + 0.5,
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


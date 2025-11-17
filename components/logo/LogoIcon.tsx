'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface LogoIconProps {
  className?: string;
  animateOnHover?: boolean;
  isHovered?: boolean;
  animationStartDelay?: number;
  autoAnimate?: boolean; // If true, animation plays automatically without hover
}

export default function LogoIcon({ className = '', animateOnHover = false, isHovered = false, animationStartDelay = 0, autoAnimate = false }: LogoIconProps) {
  // Generate random pause delay between 7-12 seconds (increased from 5-10)
  const [pauseDelay, setPauseDelay] = useState(() => 7 + Math.random() * 5);
  // Blend mode cycling for flagGradient
  const [blendMode, setBlendMode] = useState<'color-dodge' | 'multiply'>('color-dodge');
  const transformOrigin = '50% 100%'; // Bottom center of the image
  
  // Generate random scale values for each shake (between 1.03 and 1.05)
  // Each shake has 2 peaks (-3° and +3°), so we need 10 random values for 5 shakes
  const scaleValues = useState(() => {
    const values = [];
    for (let i = 0; i < 10; i++) {
      values.push(1.03 + Math.random() * 0.02); // Random between 1.03 and 1.05
    }
    return values;
  })[0];
  
  // Create scale keyframes: 1.0 at start/end of each shake, random values at peaks
  const scaleKeyframes = [
    1.0, // Start
    scaleValues[0], // Shake 1 peak 1 (-3°)
    scaleValues[1], // Shake 1 peak 2 (+3°)
    1.0, // End shake 1
    scaleValues[2], // Shake 2 peak 1
    scaleValues[3], // Shake 2 peak 2
    1.0, // End shake 2
    scaleValues[4], // Shake 3 peak 1
    scaleValues[5], // Shake 3 peak 2
    1.0, // End shake 3
    scaleValues[6], // Shake 4 peak 1
    scaleValues[7], // Shake 4 peak 2
    1.0, // End shake 4
    scaleValues[8], // Shake 5 peak 1
    scaleValues[9], // Shake 5 peak 2
    1.0, // End shake 5 / Start
  ];
  
  // Regenerate random delay on each mount for variety
  useEffect(() => {
    setPauseDelay(7 + Math.random() * 5);
  }, []);

  // Cycle blend modes for flagGradient: color-dodge -> multiply -> color-dodge
  // Synchronized with 6-second opacity animation cycle
  // Only animates when autoAnimate is true (hero) OR (animateOnHover is true AND isHovered is true) (header)
  const blendModeRef = useRef<'color-dodge' | 'multiply'>('color-dodge');
  
  useEffect(() => {
    // Only animate blend modes if autoAnimate is true OR (animateOnHover is true AND isHovered is true)
    const shouldAnimate = autoAnimate || (animateOnHover && isHovered);
    
    if (!shouldAnimate) {
      // Set to color-dodge when not animating (no normal blend mode)
      setBlendMode('color-dodge');
      blendModeRef.current = 'color-dodge';
      return;
    }
    
    const blendModes: Array<'color-dodge' | 'multiply'> = ['color-dodge', 'multiply'];
    
    // Set initial blend mode
    setBlendMode(blendModes[0]);
    blendModeRef.current = blendModes[0];
    
    // Cycle through blend modes, synchronized with 6-second opacity cycle
    // Change at exact points: 0s (color-dodge), 4.5s (multiply), 9s (color-dodge - loops)
    const cycleDuration = 9000; // 9 seconds - slower blend mode transitions
    const segmentDuration = cycleDuration / 2; // 4500ms per segment (2 blend modes)
    
    // Use requestAnimationFrame for frame-perfect synchronization
    let startTime = performance.now();
    let animationFrameId: number;
    
    const animate = () => {
      // Check if we should still be animating
      const currentShouldAnimate = autoAnimate || (animateOnHover && isHovered);
      if (!currentShouldAnimate) {
        setBlendMode('color-dodge');
        blendModeRef.current = 'color-dodge';
        return;
      }
      
      const elapsed = performance.now() - startTime;
      const cyclePosition = (elapsed % cycleDuration) / cycleDuration; // 0 to 1
      
      // Determine which blend mode based on cycle position (2 segments: color-dodge and multiply)
      let targetIndex: number;
      if (cyclePosition < 0.5) {
        targetIndex = 0; // color-dodge (0s - 4.5s)
      } else {
        targetIndex = 1; // multiply (4.5s - 9s)
      }
      
      const targetBlendMode = blendModes[targetIndex];
      
      // Update if blend mode changed
      if (targetBlendMode !== blendModeRef.current) {
        blendModeRef.current = targetBlendMode;
        setBlendMode(targetBlendMode);
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [autoAnimate, animateOnHover, isHovered]);
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
          isolation: 'isolate', // Isolate this animation layer
        }}
        initial={{
          scale: 1,
          rotate: 0,
        }}
        animate={(autoAnimate || (animateOnHover && isHovered)) ? {
          scale: [0.97, 1.03, 0.97], // Start at 97% size, grow to 103%, back to 97%
          rotate: [-2, 2, -2], // Rotate opposite direction
        } : {
          scale: 1,
          rotate: 0,
        }}
        whileHover={animateOnHover && !autoAnimate ? {
          scale: [0.97, 1.03, 0.97],
          rotate: [-2, 2, -2],
        } : undefined}
        transition={{
          scale: {
            duration: 6,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
            delay: 0,
          },
          rotate: {
            duration: 6,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
            delay: 0,
          },
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
          transformOrigin: transformOrigin,
          WebkitTransformOrigin: transformOrigin,
          MozTransformOrigin: transformOrigin,
          msTransformOrigin: transformOrigin,
          willChange: 'transform',
          isolation: 'isolate', // Isolate this animation layer
        }}
        initial={{
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1.0,
        }}
        animate={(autoAnimate || (animateOnHover && isHovered)) ? {
          rotate: [0, -3, 3, 0, -3, 3, 0, -3, 3, 0, -3, 3, 0, -3, 3, 0], // Five shakes: 0° → -3° → +3° → 0° (x5)
          scale: scaleKeyframes, // Scale animation with random values between 1.03-1.05 at each shake peak
        } : {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1.0,
        }}
        whileHover={animateOnHover && !autoAnimate ? {
          rotate: [0, -3, 3, 0, -3, 3, 0, -3, 3, 0, -3, 3, 0, -3, 3, 0], // Five shakes: 0° → -3° → +3° → 0° (x5)
          scale: scaleKeyframes, // Scale animation with random values between 1.03-1.05 at each shake peak
        } : undefined}
        transition={{
          rotate: {
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'loop',
            delay: (!autoAnimate && animateOnHover) ? 0 : (animationStartDelay - 0.15), // No delay on header hover, delay for hero auto-animate
            repeatDelay: pauseDelay, // Random pause between 5-10 seconds
            times: [0, 0.067, 0.133, 0.2, 0.267, 0.333, 0.4, 0.467, 0.533, 0.6, 0.667, 0.733, 0.8, 0.867, 0.933, 1], // Even distribution for 5 shakes within 0.5s
          },
          scale: {
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'loop',
            delay: (!autoAnimate && animateOnHover) ? 0 : (animationStartDelay - 0.15), // No delay on header hover, delay for hero auto-animate
            repeatDelay: pauseDelay, // Random pause between 5-10 seconds
            times: [0, 0.067, 0.133, 0.2, 0.267, 0.333, 0.4, 0.467, 0.533, 0.6, 0.667, 0.733, 0.8, 0.867, 0.933, 1], // Even distribution for 5 shakes within 0.5s
          },
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
          {/* Shine gradient overlay - temporarily removed for testing */}
          {/* <motion.div
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
            animate={(autoAnimate || (animateOnHover && isHovered)) ? {
              backgroundPosition: ['200% 200%', '-200% -200%'],
            } : undefined}
            whileHover={animateOnHover && !autoAnimate ? {
              backgroundPosition: ['200% 200%', '-200% -200%'],
            } : undefined}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 7.5, // Average of 7-9 seconds
              ease: 'easeInOut',
              delay: animationStartDelay + 0.5,
            }}
          /> */}
        </div>
        
        {/* Flag - child layer (moves independently but also affected by hand) */}
        <motion.div
          data-framer-component
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            transformOrigin: 'top left',
            overflow: 'visible',
          }}
          initial={{
            rotate: 0,
            scaleX: 1,
            scaleY: 1,
          }}
          animate={(autoAnimate || (animateOnHover && isHovered)) ? {
            rotate: [0, -1, 1, 0], // Waving rotation
            scaleX: [1, 1.02, 0.98, 1], // Slight horizontal stretch
            scaleY: [1, 1.02, 0.98, 1], // Slight vertical stretch
          } : {
            rotate: 0,
            scaleX: 1,
            scaleY: 1,
          }}
          whileHover={animateOnHover && !autoAnimate ? {
            rotate: [0, -1, 1, 0], // Waving rotation
            scaleX: [1, 1.02, 0.98, 1],
            scaleY: [1, 1.02, 0.98, 1],
          } : undefined}
          transition={{
            rotate: {
              duration: 6,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
              delay: 0,
            },
            scaleX: {
              duration: 6,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
              delay: 0,
            },
            scaleY: {
              duration: 6,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
              delay: 0,
            },
          }}
        >
          {/* Flag group - gradient and flag grouped together, same size and position */}
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Flag image - base layer */}
            <Image
              src="/claim-icon/ico-flag.svg"
              alt=""
              fill
              className="object-contain"
              style={{
                zIndex: 3,
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
              }}
              priority
              unoptimized
            />
            {/* Flag gradient - above flag on z-axis, relatively positioned and responsive */}
            <motion.div
              data-framer-component
              style={{
                position: 'absolute',
                left: '45%',
                top: '15.125%',
                width: '52.5%',
                height: '54.875%',
                zIndex: 4,
                mixBlendMode: blendMode,
              }}
              animate={(autoAnimate || (animateOnHover && isHovered)) ? {
                opacity: [0.05, 1, 0.05],
              } : {
                opacity: 1,
              }}
              whileHover={animateOnHover && !autoAnimate ? {
                opacity: [0.05, 1, 0.05],
              } : undefined}
              transition={{
                opacity: {
                  duration: 6,
                  repeat: Infinity,
                  repeatType: 'loop',
                  ease: 'easeInOut',
                },
              }}
            >
              <Image
                src="/claim-icon/flagGradient.svg"
                alt=""
                fill
                className="object-contain"
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                }}
                priority
                unoptimized
              />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}


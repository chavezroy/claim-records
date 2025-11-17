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
  // Final opacity states that combine crossfade and pulsing animations
  const [colorDodgeFinalOpacity, setColorDodgeFinalOpacity] = useState(0.05);
  const [multiplyFinalOpacity, setMultiplyFinalOpacity] = useState(0);
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

  // Calculate final opacity combining crossfade and pulsing animations
  // Synchronized with 6-second opacity animation cycle for seamless loop
  // Only animates when autoAnimate is true (hero) OR (animateOnHover is true AND isHovered is true) (header)
  useEffect(() => {
    // Only animate blend modes if autoAnimate is true OR (animateOnHover is true AND isHovered is true)
    const shouldAnimate = autoAnimate || (animateOnHover && isHovered);
    
    if (!shouldAnimate) {
      // Set to color-dodge when not animating
      setColorDodgeFinalOpacity(0.05);
      setMultiplyFinalOpacity(0);
      return;
    }
    
    // Cycle through blend modes with smooth crossfade, synchronized with 6-second opacity cycle
    // Equal timing for each segment: 0s (color-dodge), 2s (multiply), 4s (color-dodge), 6s (loops seamlessly)
    const cycleDuration = 6000; // 6 seconds - matches opacity animation duration
    
    // Use requestAnimationFrame for frame-perfect synchronization
    let startTime = performance.now();
    let animationFrameId: number;
    
    const animate = () => {
      // Check if we should still be animating
      const currentShouldAnimate = autoAnimate || (animateOnHover && isHovered);
      if (!currentShouldAnimate) {
        setColorDodgeFinalOpacity(0.05);
        setMultiplyFinalOpacity(0);
        return;
      }
      
      const elapsed = performance.now() - startTime;
      const cyclePosition = (elapsed % cycleDuration) / cycleDuration; // 0 to 1
      
      // Calculate crossfade opacity (3 equal segments: color-dodge -> multiply -> color-dodge)
      let dodgeCrossfade: number;
      let multiplyCrossfade: number;
      
      if (cyclePosition < 0.333333) {
        // Segment 1 (0-2s): color-dodge at full, multiply fading out
        dodgeCrossfade = 1;
        multiplyCrossfade = 0;
      } else if (cyclePosition < 0.666667) {
        // Segment 2 (2-4s): crossfade from color-dodge to multiply
        const segmentPosition = (cyclePosition - 0.333333) / 0.333334; // 0 to 1 within segment
        dodgeCrossfade = 1 - segmentPosition; // Fade out color-dodge
        multiplyCrossfade = segmentPosition; // Fade in multiply
      } else {
        // Segment 3 (4-6s): color-dodge fading in, multiply fading out
        const segmentPosition = (cyclePosition - 0.666667) / 0.333333; // 0 to 1 within segment
        dodgeCrossfade = segmentPosition; // Fade in color-dodge
        multiplyCrossfade = 1 - segmentPosition; // Fade out multiply
      }
      
      // Calculate pulsing opacity based on cycle position (matching keyframe times)
      // Smooth transitions to prevent jumps during crossfade
      let dodgePulsing: number;
      let multiplyPulsing: number;
      
      if (cyclePosition < 0.333333) {
        // 0-2s: 0.05 → 1
        const t = cyclePosition / 0.333333;
        dodgePulsing = 0.05 + (1 - 0.05) * t;
        multiplyPulsing = 0.05 + (1 - 0.05) * t;
      } else if (cyclePosition < 0.5) {
        // 2-3s: smooth transition from 1 → 0.05, then 0.05 → peak
        // For color-dodge: fade out smoothly from 1 to 0.05, then build to 0.5
        // For multiply: fade in from 0.05 to peak at 1
        const segmentPos = (cyclePosition - 0.333333) / (0.5 - 0.333333);
        // Color-dodge: extended smooth fade from 1 to 0.05, then to 0.5
        if (segmentPos < 0.65) {
          // First 65%: slow, extended fade from 1 to 0.05 (with easing for slower start)
          const fadeT = segmentPos / 0.65;
          // Ease-out cubic for slower fade at the beginning
          const easedT = 1 - Math.pow(1 - fadeT, 3);
          dodgePulsing = 1 - (1 - 0.05) * easedT;
        } else {
          // Remaining 35%: build from 0.05 to 0.5
          const buildT = (segmentPos - 0.65) / 0.35;
          dodgePulsing = 0.05 + (0.5 - 0.05) * buildT;
        }
        // Multiply: build from 0.05 to 1
        multiplyPulsing = 0.05 + (1 - 0.05) * segmentPos;
      } else if (cyclePosition < 0.666667) {
        // 3-4s: peak → 0.05
        const t = (cyclePosition - 0.5) / (0.666667 - 0.5);
        dodgePulsing = 0.5 - (0.5 - 0.05) * t; // From 0.5 to 0.05
        multiplyPulsing = 1 - (1 - 0.05) * t; // From 1 to 0.05
      } else {
        // 4-6s: stay at 0.05
        dodgePulsing = 0.05;
        multiplyPulsing = 0.05;
      }
      
      // Combine crossfade and pulsing for final opacity
      setColorDodgeFinalOpacity(dodgeCrossfade * dodgePulsing);
      setMultiplyFinalOpacity(multiplyCrossfade * multiplyPulsing);
      
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
            {/* Flag gradient layers - crossfading between blend modes for smooth transitions */}
            {/* Color-dodge layer */}
            <div
              style={{
                position: 'absolute',
                left: '45%',
                top: '15.125%',
                width: '52.5%',
                height: '54.875%',
                zIndex: 4,
                mixBlendMode: 'color-dodge',
                opacity: colorDodgeFinalOpacity, // Final opacity combining crossfade and pulsing
                transition: 'opacity 0.1s linear', // Smooth updates
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
            </div>
            {/* Multiply layer */}
            <div
              style={{
                position: 'absolute',
                left: '45%',
                top: '15.125%',
                width: '52.5%',
                height: '54.875%',
                zIndex: 5,
                mixBlendMode: 'multiply',
                opacity: multiplyFinalOpacity, // Final opacity combining crossfade and pulsing
                transition: 'opacity 0.1s linear', // Smooth updates
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
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}


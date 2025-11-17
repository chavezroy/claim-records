'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function NotFound() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [centerX, setCenterX] = useState(0);
  const [endX, setEndX] = useState(0);
  const [stopPoint1, setStopPoint1] = useState(0);
  const [totalDuration, setTotalDuration] = useState(8);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const calculatePositions = () => {
      if (pageRef.current) {
        const containerWidth = pageRef.current.offsetWidth;
        const imageWidth = 100;
        const center = containerWidth / 2 - imageWidth / 2;
        const end = containerWidth; // Right edge of container
        
        // Calculate stop point: closer to left edge (halfway from current position)
        const stop1 = center / 4;
        
        // Calculate timing: 4s to center, 4s to end (no wait) - faster speed
        const timeToCenter = 4;
        const timeToEnd = 4;
        const total = timeToCenter + timeToEnd; // 8 seconds total
        
        setCenterX(center);
        setEndX(end);
        setStopPoint1(stop1);
        setTotalDuration(total);
        setIsReady(true);
      }
    };

    calculatePositions();
    window.addEventListener('resize', calculatePositions);
    return () => window.removeEventListener('resize', calculatePositions);
  }, []);

  return (
    <>
      {/* Critical styles in global CSS to prevent FOUC */}
      <style dangerouslySetInnerHTML={{__html: `
        .not-found-page {
          position: relative;
          height: 100%;
          width: 100%;
          overflow-x: visible;
        }
        .tumbleweed-container {
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 10;
          pointer-events: none;
        }
        .tumbleweed-image {
          display: block;
          object-fit: contain;
        }
        .not-found-content {
          position: relative;
          z-index: 20;
          padding: 5rem 0;
          min-height: 60vh;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
        }
        .not-found-title {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: #ec4824;
        }
        .not-found-message {
          font-size: 1.25rem;
          margin-bottom: 2rem;
        }
        .not-found-link {
          color: #ec4824;
          text-decoration: none;
        }
        .not-found-link:hover {
          text-decoration: underline;
        }
        @media (min-width: 576px) {
          .not-found-content {
            max-width: 540px;
            margin: 0 auto;
            padding-left: 15px;
            padding-right: 15px;
          }
        }
        @media (min-width: 768px) {
          .not-found-content {
            max-width: 720px;
          }
        }
        @media (min-width: 992px) {
          .not-found-content {
            max-width: 960px;
          }
        }
        @media (min-width: 1200px) {
          .not-found-content {
            max-width: 1140px;
          }
        }
      `}} />
      
      <div ref={pageRef} className="not-found-page">
        {/* Tumbleweed Animation */}
        {isReady && centerX > 0 && (
          <motion.div
            className="tumbleweed-container"
            data-framer-component
            initial={{ x: 0, y: -200, rotate: 0 }}
            animate={{
              x: [0, stopPoint1, centerX, endX],
              y: [-200, 0, -50, 0, -200], // Natural bounce: drop to ground, arch up between stop1 and center, bounce up at end
              rotate: [0, 540, 1080], // Rotate: start, middle (center), end - more spin (3 total rotations)
            }}
            transition={{
              x: {
                duration: totalDuration,
                times: [
                  0, 
                  1.2 / totalDuration, // Stop point 1 (adjusted for faster speed)
                  4 / totalDuration, // End of first movement (4s)
                  1 // End of second movement (4s + 4s = 8s)
                ],
                ease: [
                  'linear', // Constant speed to keyframe 2
                  'linear', // Constant speed from keyframe 2 to 3
                  'linear', // Constant speed from keyframe 3 to 4
                ],
                type: 'tween',
                repeat: Infinity,
                repeatDelay: 3,
              },
              y: {
                duration: totalDuration,
                times: [
                  0, 
                  1.2 / totalDuration, // Stop point 1
                  2.6 / totalDuration, // Peak of arch (midway between stop1 and center)
                  4 / totalDuration, // End of first movement (4s) - center
                  1 // End of second movement (4s + 4s = 8s)
                ],
                ease: [
                  [0.33, 1, 0.68, 1], // Gentle float down: low gravity effect
                  [0.16, 1, 0.3, 1], // Smooth float up: wind lifting
                  [0.33, 1, 0.68, 1], // Gentle float down: low gravity settling
                  [0.68, -0.55, 0.265, 1.55], // Bounce ease-in for bouncing up
                ],
                type: 'tween',
                repeat: Infinity,
                repeatDelay: 3,
              },
              rotate: {
                duration: totalDuration,
                times: [
                  0, 
                  4 / totalDuration, // Middle (center) - end of first movement (4s)
                  1 // End of second movement (4s + 4s = 8s)
                ],
                ease: [
                  'linear', // No easing: constant speed
                  [0.42, 0, 1, 1], // Ease-in: accelerate, maintain speed at end
                ],
                type: 'tween',
                repeat: Infinity,
                repeatDelay: 3,
              },
            }}
          >
            <Image
              src="/tumbleweed-.png"
              alt="Tumbleweed"
              width={100}
              height={100}
              className="tumbleweed-image"
              unoptimized
              priority
            />
          </motion.div>
        )}

        {/* 404 Content */}
        <div className="not-found-content">
          <h1 className="not-found-title">404</h1>
          <p className="not-found-message">Page not found</p>
          <Link href="/" className="not-found-link">
        Return home
      </Link>
    </div>
      </div>
    </>
  );
}


'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function AnimatedLogo() {
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    // Load the SVG content
    fetch('/img/logo_ClaimRecords.svg')
      .then((res) => res.text())
      .then((text) => {
        // Remove XML declaration and extract just the SVG content
        const svgMatch = text.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
        if (svgMatch) {
          setSvgContent(svgMatch[1]);
        }
      })
      .catch((err) => console.error('Failed to load SVG:', err));
  }, []);

  // Animation variants for outer circle (stroke drawing)
  const circleVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const },
        opacity: { duration: 0.3, delay: 0.2 },
      },
    },
  };

  // Animation variants for text paths
  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.5,
        duration: 0.3,
      },
    },
  };

  const textPathVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 5 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  // Animation variants for decorative paths - batch fade-in for performance
  const decorativeContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.01,
        delayChildren: 1.2,
        duration: 0.2,
      },
    },
  };

  const decorativePathVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  return (
    <motion.div
      className="w-[300px] sm:w-[350px] md:w-[600px]"
      data-framer-component
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
      }}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 2883.2 1043.9"
        className="w-full h-auto"
        initial="hidden"
        animate="visible"
        style={{
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
      >
        <defs>
          <style>
            {`
              .st0 { fill: #0c0b0a; }
              .st1 { fill: #2d2e2d; }
              .st2 { fill: #fff; fill-rule: evenodd; }
              .st3 { fill: #231f20; }
              .st4 { fill: #e83226; }
              .st5 { fill: #89969d; }
              .st6, .st7 { fill: #f6f0e0; }
              .st8 { fill: #0a0a0a; }
              .st7 { stroke: #000; stroke-miterlimit: 10; stroke-width: 15px; }
            `}
          </style>
        </defs>

        {/* Outer Circle - Animated first */}
        <motion.g
          variants={circleVariants}
          initial="hidden"
          animate="visible"
          data-framer-component
        >
          <motion.circle
            className="st7"
            cx="438.8"
            cy="591"
            r="415.6"
            fill="none"
            stroke="#000"
            strokeWidth="15"
            strokeMiterlimit="10"
            style={{
              willChange: 'stroke-dasharray, stroke-dashoffset',
            }}
          />
          <circle cx="439.6" cy="590.7" r="390.1" fill="#f6f0e0" />
        </motion.g>

        {/* Text Group - "CLAIM RECORDS" - Animated second */}
        <motion.g
          variants={textContainerVariants}
          initial="hidden"
          animate="visible"
          data-framer-component
        >
          {/* CLAIM text paths */}
          <motion.path
            className="st3"
            d="M1136,345.5c-17.6-11.9-40-17.1-63.8-17.1-55.8,0-99,42.7-99,94.1s43.1,95.9,99,95.9,46.2-5.3,63.8-17.1v81.8c-20.7,10.1-44,14.1-69.1,14.1-104.7,0-179.4-77.8-179.4-174.2s74.8-173.3,179.4-173.3,48.4,4.8,69.1,14.5v81.4h0Z"
            variants={textPathVariants}
          />
          <motion.path
            className="st3"
            d="M1261.3,259.3v250.7h109.1v77.4h-194.4v-328.1h85.3Z"
            variants={textPathVariants}
          />
          <motion.path
            className="st3"
            d="M1609.7,542.1h-124l-16.3,45.3h-88.8l126.2-328.1h84l126.2,328.1h-91.5l-15.8-45.3ZM1586.3,475.7l-38.3-108.6-38.7,108.6h77Z"
            variants={textPathVariants}
          />
          <motion.path
            className="st3"
            d="M1740.3,259.3h85.3v328.1h-85.3v-328.1h0Z"
            variants={textPathVariants}
          />
          <motion.path
            className="st3"
            d="M1954.4,587.4h-84.4v-328.1h87.5l96.3,131.1,91-131.1h86.6v328.1h-84.4v-168l.4-22.4-91.5,126.2h-6.6l-95.4-127.5.4,23.3v168.4h0Z"
            variants={textPathVariants}
          />

          {/* RECORDS text paths */}
          <motion.path
            className="st3"
            d="M989.1,856h-4.8v104.7h-85.3v-328.1h98.1c63.3,0,132.4,21.1,132.4,114.3s-23.8,71.2-55,88.8l86.6,124.9h-102l-69.9-104.7h0ZM984.3,708.3v81.4h15.8c28.6,0,45.3-13.6,45.3-41.3s-20.2-40-45.7-40h-15.4Z"
            variants={textPathVariants}
          />
          <motion.path
            className="st3"
            d="M1188.8,632.6h194.8v75.2h-109.5v52.8h97.6v68.2h-97.6v56.7h113v75.2h-198.3v-328.1h0Z"
            variants={textPathVariants}
          />
          <motion.path
            className="st3"
            d="M1660.7,718.8c-17.6-11.9-40-17.2-63.8-17.2-55.8,0-98.9,42.7-98.9,94.1s43.1,95.9,98.9,95.9,46.2-5.3,63.8-17.2v81.8c-20.7,10.1-44,14.1-69.1,14.1-104.7,0-179.4-77.8-179.4-174.2s74.8-173.3,179.4-173.3,48.4,4.8,69.1,14.5v81.4h0Z"
            variants={textPathVariants}
          />
          <motion.path
            className="st3"
            d="M2177,856h-4.8v104.7h-85.3v-328.1h98.1c63.3,0,132.4,21.1,132.4,114.3s-23.8,71.2-55,88.8l86.6,124.9h-102l-69.9-104.7ZM2172.1,708.3v81.4h15.8c28.6,0,45.3-13.6,45.3-41.3s-20.2-40-45.7-40h-15.4Z"
            variants={textPathVariants}
          />
          <motion.path
            className="st3"
            d="M2376.6,632.6h102.5c91.5,0,175.9,46.6,175.9,163.6s-82.2,164.5-175,164.5h-103.4v-328.1h0ZM2461.9,883.3h22.4c45.7,0,85.3-28.2,85.3-87.1s-39.6-85.8-85.3-86.2h-22.4v173.3h0Z"
            variants={textPathVariants}
          />
          <motion.path
            className="st3"
            d="M2867.4,707.4c-15.8-7.5-40-12.8-60.2-12.8s-36.1,6.2-36.1,18.9,16.3,24.6,44,51.5c51.9,48.4,68.2,76.1,68.2,110.4,0,56.7-53.2,90.6-120.5,90.6s-61.6-4.8-78.7-11l.4-72.6c17.6,6.6,48.4,15,77.4,15s34.7-9.2,34.7-21.1-14.9-29-44.4-56.3c-52.8-47.1-70.8-67.7-70.8-106.9s37.4-87.1,120.9-87.1,46.6,2.2,65.5,8.8l-.4,72.6h0Z"
            variants={textPathVariants}
          />
        </motion.g>

        {/* Decorative Elements - Temporarily removed to fix build errors */}
        {/* Note: dangerouslySetInnerHTML cannot be used on SVG <g> elements in React */}
      </motion.svg>
    </motion.div>
  );
}

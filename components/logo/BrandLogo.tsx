'use client';

import Image from 'next/image';
import LogoIcon from './LogoIcon';

interface BrandLogoProps {
  className?: string;
  showAnimation?: boolean;
  animationDelay?: number;
}

export default function BrandLogo({ 
  className = '', 
  showAnimation = false,
  animationDelay = 0 
}: BrandLogoProps) {
  return (
    <div className={`hero-logo-container ${className}`}>
      <div className="hero-logo-icon">
        <LogoIcon />
      </div>
      <div className="hero-logo-text">
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
}

